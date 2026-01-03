export function ExampleComponent({ message }: { message: string }) {
  return (
    <div data-testid="example">
      <h1>Example</h1>
      <p>{message}</p>
    </div>
  );
}
