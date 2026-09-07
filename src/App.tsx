import { AppShell } from './components/AppShell';
import { CaseLaunch } from './modules/CaseLaunch';
import { Module1 } from './modules/module1/Module1';
import { Module2 } from './modules/module2/Module2';
import { useSession } from './context/SessionContext';

function App() {
  const { state } = useSession();

  return (
    <AppShell>
      {state.currentStep === 'case-launch' && <CaseLaunch />}
      {state.currentStep === 'module-1' && <Module1 />}
      {state.currentStep === 'module-2' && <Module2 />}
      {['module-3', 'module-4', 'module-5', 'module-6', 'module-7', 'module-8'].includes(
        state.currentStep,
      ) && (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-sm text-gray-500">
          โมดูลนี้ยังไม่เปิดใช้งานในต้นแบบนี้ (Not built in this build gate).
        </div>
      )}
    </AppShell>
  );
}

export default App;
