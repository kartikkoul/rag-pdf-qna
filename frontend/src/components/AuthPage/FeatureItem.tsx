import { JSX } from "react";

const FeatureItem = ({icon, featureTitle, featureDescription}: {
    icon: JSX.Element,
    featureTitle: string,
    featureDescription: string
}) => {
  return (
    <li className="flex items-center gap-4 mb-4">
                      <div className="icon text-secondary">
                        {icon}
                      </div>
                      <div className="feature">
                        <h3 className="">{featureTitle}</h3>
                        <p className="text-sm">{featureDescription}</p>
                      </div>
                    </li>
  )
}

export default FeatureItem