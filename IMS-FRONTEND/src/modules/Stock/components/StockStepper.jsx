export default function StockStepper({ steps, activeStep, onSelectStep }) {
  return (
    <div className="stock-stepper">
      <div className="stock-stepper__steps">
        {steps.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`stock-stepper__step ${index === activeStep ? 'active' : ''}`}
            onClick={() => onSelectStep(index)}
          >
            <span className="stock-stepper__step-number">{index + 1}</span>
            <span className="stock-stepper__step-label">{step.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
