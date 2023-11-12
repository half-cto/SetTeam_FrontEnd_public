import { Button, Input, InputRef, Space } from 'antd';
import { FilterConfirmProps } from 'antd/es/table/interface';
import { useRef } from 'react';

interface FilterDropDownProps {
    setSelectedKeys: (selectedKeys: React.Key[]) => void;
    selectedKeys: React.Key[];
    confirm: (param?: FilterConfirmProps | undefined) => void;
    clearFilters: (() => void) | undefined;
    close: () => void;
}

const FilterDropDown = ({
    setSelectedKeys,
    selectedKeys,
    confirm,
    close,
}: FilterDropDownProps) => {
    const searchInput = useRef<InputRef>(null);

    return (
        <div style={{ padding: 8 }}>
            <Input
                ref={searchInput}
                placeholder={`Search`}
                value={selectedKeys[0]}
                onChange={(e) => {
                    setSelectedKeys(e.target.value ? [e.target.value] : []);
                }}
                onPressEnter={() => confirm({ closeDropdown: false })}
                style={{ marginBottom: 8, display: 'block' }}
            />
            <Space>
                <Button onClick={() => confirm({ closeDropdown: false })}>
                    Filter
                </Button>
                <Button
                    onClick={() => {
                        setSelectedKeys([]);
                        confirm({ closeDropdown: true });
                    }}
                >
                    Clear
                </Button>
                <Button
                    type="link"
                    size="small"
                    onClick={() => {
                        close();
                    }}
                >
                    Close
                </Button>
            </Space>
        </div>
    );
};

export default FilterDropDown;
