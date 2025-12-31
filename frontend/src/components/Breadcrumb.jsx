import { Link } from "react-router-dom";

const Breadcrumb = ({ current }) => {
  return (
    <div className="container-fluid mt-4" id="bread">
    <nav className="mb-3">
      <ol className="breadcrumb mb-0">
        <li className="breadcrumb-item">
          <Link to="/">Dashboard</Link>
        </li>
        {current && (
          <li className="breadcrumb-item active">
            <Link to={current}>{current}</Link>
          </li>
        )}
      </ol>
    </nav>
    </div>
  );
};

export default Breadcrumb;
