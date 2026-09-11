import { Progress } from "reactstrap";
import classnames from "classnames";

interface IProgressIndicator {
    progressValue: number;
    progressColor?: string;
    progressClassName?: string;
}
export const ProgressIndicator: React.FC<IProgressIndicator> = (props) => {
    return (
        <Progress value={props.progressValue} color={props.progressColor || "primary"}
            className={classnames('animated-progress', props.progressClassName)} />
    )
}