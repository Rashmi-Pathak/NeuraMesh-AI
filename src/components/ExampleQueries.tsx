interface ExampleQueriesProps {
  onSelectQuery: (query: string) => void;
}

const examples = [
  "Should I switch careers to AI/ML engineering?",
  "Is buying a house in 2025 a good financial decision?",
  "Should I start a SaaS business or get a job?",
  "Is remote work better than office work?",
];

export const ExampleQueries = ({ onSelectQuery }: ExampleQueriesProps) => {
  return (
    <div className="max-w-4xl mx-auto mb-12 animate-fadeIn">
      <h3 className="text-xl font-semibold text-center mb-6">Try an Example Question</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {examples.map((example, idx) => (
          <button
            key={idx}
            onClick={() => onSelectQuery(example)}
            className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 hover:bg-card/80 transition-all duration-300 text-left group"
          >
            <p className="text-sm text-foreground/90 group-hover:text-primary transition-colors">
              {example}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};
