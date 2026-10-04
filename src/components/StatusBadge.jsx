import { STATUS_COLORS } from '../utils/constants';

export default function StatusBadge({ status }) {
  return (
    <span className="badge" style={{ '--c': STATUS_COLORS[status] }}>
      {status}
    </span>
  );
}