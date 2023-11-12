import { Button, Select } from 'antd';
import type { SelectProps } from 'antd';
import {
    useFetchTeamMembersQuery,
    useUpdateProjectMutation,
} from '../../../store/store';
import { useState } from 'react';

interface AddTeamSelectProps {
    project: Project;
}

const AddTeamSelect = ({ project }: AddTeamSelectProps) => {
    const [updateProject] = useUpdateProjectMutation();
    const { data: allSparks } = useFetchTeamMembersQuery(undefined);
    const [sparksToAdd, setSparksToAdd] = useState<string[]>([]);
    let options: SelectProps['options'] = [];


    options = allSparks?.map((spark) => {
        return { label: spark.name, value: spark.SK };
    });

    const handleChange = (value: string[]) => {
        setSparksToAdd(value);
    };

    const handleAddTeam = async () => {
        const updateSparks = [...project.projTeam, ...sparksToAdd];

        await updateProject({
            projId: project.SK,
            projTeam: updateSparks,
        });
        setSparksToAdd([]);
    };

    return (
        <div>
            <Select
                mode="multiple"
                allowClear
                style={{ width: '100%' }}
                placeholder="Please select"
                onChange={handleChange}
                options={options}
            />
            <Button onClick={handleAddTeam}>Add Team</Button>
        </div>
    );
};

export default AddTeamSelect;
