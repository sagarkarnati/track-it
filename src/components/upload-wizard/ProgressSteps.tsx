"use client"

import { Check } from "lucide-react"

interface Step {
    id: number
    title: string
    description: string
}

interface ProgressStepsProps {
    steps: Step[]
    currentStep: number
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
    return (
        <div className="w-full py-6">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center flex-1">
                        {/* Step Circle */}
                        <div className="flex flex-col items-center relative">
                            <div
                                className={`
                  flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                  ${currentStep > step.id
                                        ? "bg-blue-600 border-blue-600 text-white"
                                        : currentStep === step.id
                                            ? "bg-blue-600 border-blue-600 text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                    }
                `}
                            >
                                {currentStep > step.id ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <span className="text-sm font-semibold">{step.id}</span>
                                )}
                            </div>

                            {/* Step Label */}
                            <div className="absolute top-12 text-center min-w-[120px]">
                                <p
                                    className={`text-sm font-medium ${currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                                        }`}
                                >
                                    {step.title}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">{step.description}</p>
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < steps.length - 1 && (
                            <div className="flex-1 h-0.5 mx-2">
                                <div
                                    className={`h-full transition-all ${currentStep > step.id ? "bg-blue-600" : "bg-gray-300"
                                        }`}
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}
