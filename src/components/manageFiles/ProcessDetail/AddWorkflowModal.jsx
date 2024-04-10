import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { SetDocumentId } from '../../../features/app/appSlice';



export default function AddWorkflowModal(props) {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	// ("ProcessDetail", ProcessDetail, userDetail)

	const handleWorkflowSubmit = (e) => {
		dispatch(SetDocumentId(props.step));
		navigate("/workflows/new-set-workflow-document-step")
	};

	return (
		<Modal
			{...props}
			size="md"
			aria-labelledby="contained-modal-title-vcenter"
			// centered
		>
			<Modal.Header closeButton>
				{/* <Modal.Title>
					Add Workflow to Step
				</Modal.Title> */}
				{/* <div>
					<div className="d-grid gap-2">
						<Button variant='success' onClick={handleWorkflowSubmit}>Add Workflow in this step</Button>
					</div>
				</div> */}
			</Modal.Header>
			<Modal.Body>
				<div>
					<div className="d-grid gap-2">
						<Button variant='success' onClick={handleWorkflowSubmit}>Add Workflow in this step</Button>
					</div>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button  variant="outlined" onClick={props.onHide}>Not Interested</Button>
			</Modal.Footer>
		</Modal>
	);
}
