import './CustomButtons.css';
import { Button } from "@material-ui/core";

const SubmitButton = (props) => {
    return (
        <Button
            variant={props.variant}
            type={props.type}
            className="submit-button"
            disabled={props.disabled}
            onClick={props.onClick}
            style={{ width: props.customWidth || '100%' }}
        >
            {props.title}
        </Button>
    )
};

const CancelButton = (props) => {
    return (
        <Button
            variant={props.variant}
            type={props.type}
            className="cancel-button"
            disabled={props.disabled}
            onClick={props.onClick}
            style={{ width: props.customWidth || '100%' }}
        >
            {props.title}
        </Button>
    )
};

const UploadButton = (props) => {
    return (
        <Button
            className="upload-button"
            component="span"
            disabled={props.disabled}
            onClick={props.onClick}
        >
            {props.title}
        </Button>
    )
};

export { SubmitButton, CancelButton, UploadButton };