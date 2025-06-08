import LinearEquationsVisualizer from "../components/problems/linear-equations/LinearEquationsVisualizer";

export const metadata = {
  title: 'Linear Equations Solver - Quantum vs Classical',
  description: 'Compare classical Gaussian elimination with quantum HHL algorithm for solving systems of linear equations',
};

export default function LinearEquationsPage() {
  return (
    <main className="min-h-screen">
      <LinearEquationsVisualizer />
    </main>
  );
}
