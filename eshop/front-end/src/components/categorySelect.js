import { TreeSelect } from 'antd';

const { TreeNode } = TreeSelect;
function renderTreeNodes(nodes) {
    return Object.entries(nodes).map(([id, node]) => {
        const { name, subcategories } = node;
        return (
            <TreeNode key={id} value={id} title={name}>
                {subcategories && renderTreeNodes(subcategories)}
            </TreeNode>
        );
    });
}

export default function CategorySelect({ categories, value, onChange }) {
    return (
        <TreeSelect
            showSearch
            style={{ width: '100%' }}
            value={value}
            onChange={onChange}
            placeholder="Select a category"
            allowClear
        >
            {renderTreeNodes(categories)}
        </TreeSelect>
    );
}
