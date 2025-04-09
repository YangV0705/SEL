
import SchemaSection from './components/SchemaSection';

export default function App() {
  return (
    <main className="min-h-screen bg-black text-white font-mono p-6">
      <h1 className="text-3xl font-bold text-green-400 mb-4">Mission 1: Maintenance Window Exploit</h1>
      <p className="text-lg mb-6 text-cyan-300">
        <span className="text-blue-400 font-bold">Nova:</span> "83% of breaches occur during patching windows. Find incidents between <span className="underline">2:00–4:30 AM</span>."
      </p>
      <SchemaSection />
    </main>
  );
}
