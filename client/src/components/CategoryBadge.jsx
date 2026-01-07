import PropTypes from 'prop-types';

const CategoryBadge = ({ category, icon, color }) => {
    return (
        <span
            className="category-badge"
            style={{
                backgroundColor: color || '#667eea',
                borderColor: color || '#667eea'
            }}
        >
            {icon && <span className="badge-icon">{icon}</span>}
            <span className="badge-text">{category}</span>
        </span>
    );
};

CategoryBadge.propTypes = {
    category: PropTypes.string.isRequired,
    icon: PropTypes.string,
    color: PropTypes.string
};

export default CategoryBadge;
