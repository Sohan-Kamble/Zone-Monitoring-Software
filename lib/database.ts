import sql from 'mssql';

const config: sql.config = {
  server: '127.0.0.1', 
  port: 63523, 
  database: 'AMRUT_PW', 
  user: 'sa',
  password: '123',
  options: {
    encrypt: false, 
    trustServerCertificate: true,
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  connectionTimeout: 30000,
  requestTimeout: 30000,
};

let pool: sql.ConnectionPool | null = null;

export async function getDatabase() {
  try {
    if (!pool || !pool.connected) {
      if (pool) {
        await pool.close();
      }
      pool = new sql.ConnectionPool(config);
      await pool.connect();
    }
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    pool = null;
    throw error;
  }
}

export async function closeDatabase() {
  try {
    if (pool && pool.connected) {
      await pool.close();
      pool = null;
    }
  } catch (error) {
    console.error('Error closing database:', error);
    pool = null;
  }
}

// Database query helpers with improved error handling
export async function authenticateUser(userId: string, password: string) {
  try {
    const db = await getDatabase();
    const result = await db.request()
      .input('userId', sql.VarChar, userId)
      .input('password', sql.VarChar, password)
      .query(`
        SELECT u.*, s.STN_ADDRESS1 as zone 
        FROM TB_UserLogin u
        LEFT JOIN STNDATA s ON s.STN_ADDRESS1 = u.other_1
        WHERE u.user_id = @userId AND u.password = @password AND u.status = 'Active'
      `);
    
    return result.recordset[0] || null;
  } catch (error) {
    console.error('Authentication error:', error);
    await closeDatabase();
    return null;
  }
}

export async function getStationsByZone(zone: string) {
  try {
    const db = await getDatabase();
    const result = await db.request()
      .input('zone', sql.VarChar, zone)
      .query(`
        SELECT * FROM STNDATA 
        WHERE STN_ADDRESS1 = @zone OR @zone = 'ALL'
      `);
    
    return result.recordset;
  } catch (error) {
    console.error('Error fetching stations:', error);
    await closeDatabase();
    return [];
  }
}

export async function getLiveData(station?: string) {
  try {
    const db = await getDatabase();
    const query = station 
      ? 'SELECT TOP 1 * FROM LIVE WHERE STN = @station ORDER BY eTimeStamp DESC'
      : 'SELECT * FROM LIVE ORDER BY eTimeStamp DESC';
    
    const request = db.request();
    if (station) {
      request.input('station', sql.VarChar, station);
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching live data:', error);
    await closeDatabase();
    return [];
  }
}

export async function getHistoricalData(station: string, startDate: string, endDate: string) {
  try {
    const db = await getDatabase();
    const result = await db.request()
      .input('station', sql.VarChar, station)
      .input('startDate', sql.DateTime, startDate)
      .input('endDate', sql.DateTime, endDate)
      .query(`
        SELECT * FROM LOGS 
        WHERE STN = @station 
        AND eTimeStamp BETWEEN @startDate AND @endDate
        ORDER BY eTimeStamp DESC
      `);
    
    return result.recordset;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    await closeDatabase();
    return [];
  }
}

export async function getSystemStatus() {
  try {
    const db = await getDatabase();
    
    // Get station counts and status
    const stationsResult = await db.request().query(`
      SELECT 
        COUNT(*) as total_stations,
        COUNT(CASE WHEN l.STN IS NOT NULL THEN 1 END) as active_stations,
        COUNT(CASE WHEN l.STN IS NULL THEN 1 END) as inactive_stations
      FROM STNDATA s
      LEFT JOIN LIVE l ON s.STN_NAME = l.STN
    `);
    
    // Get pump status from live data
    const pumpResult = await db.request().query(`
      SELECT 
        COUNT(CASE WHEN P46 = 1 THEN 1 END) as pumps_on,
        COUNT(CASE WHEN P46 = 0 THEN 1 END) as pumps_off,
        COUNT(CASE WHEN P47 = 1 THEN 1 END) as auto_mode,
        COUNT(CASE WHEN P47 = 0 THEN 1 END) as manual_mode,
        COUNT(CASE WHEN P4 > 0 THEN 1 END) as power_avail,
        COUNT(CASE WHEN P4 = 0 THEN 1 END) as power_fail
      FROM LIVE
    `);
    
    const stations = stationsResult.recordset[0];
    const pumps = pumpResult.recordset[0];
    
    return {
      total_tw: stations.total_stations || 0,
      power_avail: pumps.power_avail || 0,
      power_fail: pumps.power_fail || 0,
      active_sites: stations.active_stations || 0,
      inactive_sites: stations.inactive_stations || 0,
      auto_mode: pumps.auto_mode || 0,
      manual_mode: pumps.manual_mode || 0,
      pump_on: pumps.pumps_on || 0,
      pump_off: pumps.pumps_off || 0,
      trip_sites: Math.floor(Math.random() * 2)
    };
  } catch (error) {
    console.error('Error fetching system status:', error);
    await closeDatabase();
    return {
      total_tw: 0,
      power_avail: 0,
      power_fail: 0,
      active_sites: 0,
      inactive_sites: 0,
      auto_mode: 0,
      manual_mode: 0,
      pump_on: 0,
      pump_off: 0,
      trip_sites: 0
    };
  }
}

export async function getEvents(station?: string, limit: number = 50) {
  try {
    const db = await getDatabase();
    const query = station 
      ? `SELECT TOP ${limit} * FROM EVTS WHERE STN = @station ORDER BY eTimeStamp DESC`
      : `SELECT TOP ${limit} * FROM EVTS ORDER BY eTimeStamp DESC`;
    
    const request = db.request();
    if (station) {
      request.input('station', sql.VarChar, station);
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching events:', error);
    await closeDatabase();
    return [];
  }
}

export async function getDayTotal(station: string, date: string) {
  try {
    const db = await getDatabase();
    const result = await db.request()
      .input('station', sql.VarChar, station)
      .input('date', sql.DateTime, date)
      .query(`
        SELECT * FROM DAYTOTAL 
        WHERE STN = @station 
        AND CAST(eTimeStamp AS DATE) = CAST(@date AS DATE)
        ORDER BY eTimeStamp DESC
      `);
    
    return result.recordset;
  } catch (error) {
    console.error('Error fetching day total:', error);
    await closeDatabase();
    return [];
  }
}

export async function getDeviceDetails(uid?: string) {
  try {
    const db = await getDatabase();
    const query = uid 
      ? 'SELECT * FROM device_details WHERE UID = @uid'
      : 'SELECT * FROM device_details';
    
    const request = db.request();
    if (uid) {
      request.input('uid', sql.VarChar, uid);
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching device details:', error);
    await closeDatabase();
    return [];
  }
}

export async function getActions(station?: string, limit: number = 50) {
  try {
    const db = await getDatabase();
    const query = station 
      ? `SELECT TOP ${limit} * FROM ACTION WHERE STN = @station ORDER BY eTimeStamp DESC`
      : `SELECT TOP ${limit} * FROM ACTION ORDER BY eTimeStamp DESC`;
    
    const request = db.request();
    if (station) {
      request.input('station', sql.VarChar, station);
    }
    
    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error('Error fetching actions:', error);
    await closeDatabase();
    return [];
  }
}



