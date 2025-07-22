// 'use client';

// import { Header } from '@/components/Layout/Header';
// import { StatusBar } from '@/components/Layout/StatusBar';
// import { AdvancedReport } from '@/components/reports/AdvancedReport';

// export default function ZonePage() {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header currentPage="zone" />
//       <StatusBar />
      
//       <main className="container mx-auto px-4 py-6">
//         <div className="space-y-6">
//           {/* Page Header */}
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Zone Report</h1>
//             <p className="text-gray-600">Generate comprehensive reports for specific zones and date ranges</p>
//           </div>

//           <AdvancedReport />
//         </div>
//       </main>
//     </div>
//   );
// }

'use client';

import dynamic from 'next/dynamic';
import { Header } from '@/components/Layout/Header';
import { StatusBar } from '@/components/Layout/StatusBar';

// Dynamically import the named export `AdvancedReport`
const AdvancedReport = dynamic(
  () => import('@/components/reports/AdvancedReport').then(mod => mod.AdvancedReport),
  { ssr: false }
);

export default function ZonePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="zone" />
      <StatusBar />
      
      <main className="container mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Zone Report</h1>
            <p className="text-gray-600">
              Generate comprehensive reports for specific zones and date ranges
            </p>
          </div>

          <AdvancedReport />
        </div>
      </main>
    </div>
  );
}
