import { AppShell } from './components/AppShell';
import { A4ReadinessSummary } from './components/A4ReadinessSummary';
import { CaseLaunch } from './modules/CaseLaunch';
import { Module1 } from './modules/module1/Module1';
import { Module2 } from './modules/module2/Module2';
import { Module3 } from './modules/module3/Module3';
import { Module4 } from './modules/module4/Module4';
import { useSession } from './context/SessionContext';

function App() {
  const { state } = useSession();

  return (
    <AppShell>
      {state.currentStep === 'case-launch' && <CaseLaunch />}
      {state.currentStep === 'module-1' && <Module1 />}
      {state.currentStep === 'module-2' && <Module2 />}
      {state.currentStep === 'module-3' && <Module3 />}
      {state.currentStep === 'module-4' && <Module4 />}
      {['module-5', 'module-6', 'module-7', 'module-8'].includes(state.currentStep) && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          โมดูลนี้ยังไม่เปิดใช้งานในต้นแบบนี้ (Not built in this build gate).
        </div>
      )}
      {state.hasEnteredLab && <A4ReadinessSummary />}
    </AppShell>
  );
}

export default App;

