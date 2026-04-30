import { JSX } from "react";

const FeatureItem = ({icon, featureTitle, featureDescription}: {
    icon: JSX.Element,
    featureTitle: string,
    featureDescription: string
}) => {
  return (
    <li className="group flex items-start gap-4 rounded-lg px-2 py-3 transition-colors duration-200 hover:bg-white/5">
                      <div className="icon text-secondary mt-0.5">
                        {icon}
                      </div>
                      <div className="feature">
                        <h3 className="text-sm tracking-wide font-semibold text-neutral-100">{featureTitle}</h3>
                        <p className="text-sm text-neutral-400">{featureDescription}</p>
                      </div>
                    </li>
  )
}

export default FeatureItem