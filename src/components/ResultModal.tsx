interface Props {
  title: string;
  message: string;
  onClose: () => void;
}

export const ResultModal = ({ title, message, onClose }: Props) => {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <h3>{title}</h3>
        <p>{message}</p>
        <button className="primary" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};

