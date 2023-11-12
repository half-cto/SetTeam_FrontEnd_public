import { Button } from 'antd';
import { useDispatch } from 'react-redux';
import {
    updateActiveDate,
    updateActiveDateAndPage,
    useRemoveDatesFromProjectMutation,
} from '../../../store/store';
import { ProjDate } from '../../../store/apis/datesApi';
import { removeProjectFromDate } from '../../main-app/project/projUtils';

interface ViewEditActionBtnsProps {
    date: string;
    projDates: ProjDate[];
    project: Project;
}

const ViewEditActionBtns = ({
    date,
    projDates,
    project,
}: ViewEditActionBtnsProps) => {
    const dispatch = useDispatch();

    const [removeDatesFromProject] = useRemoveDatesFromProjectMutation();

    const handleViewProjDate = () => {
        dispatch(
            updateActiveDateAndPage({
                activeDate: date,
                displayPage: 'project',
            })
        );
    };

    // disable delete button if project has only one date
    const isDisabled = project.projDates.length === 1 ? true : false;

    const handleRemoveDate = async () => {
        if (project.projDates.length === 1) {
            console.log('Cant delete last project date');
            return;
        }

        // get selected date from projDates
        let dateToUpdate = projDates.filter(
            (projDate) => projDate.SK === date
        )[0];

        //  remove project from selected date
        dateToUpdate = removeProjectFromDate(project.SK, dateToUpdate);

        // remove date from project entry
        const newProjDates = project.projDates.filter(
            (projDate) => projDate !== date
        );

        dispatch(updateActiveDate({ activeDate: newProjDates[0] }));
        //send request to backend

        await removeDatesFromProject({
            projId: project.SK,
            projDates: newProjDates,
            datesToUpdate: [dateToUpdate],
        });
    };

    return (
        <div className="flex gap-2 justify-end">
            <Button
                type="primary"
                className="bg-blue-500"
                onClick={handleViewProjDate}
            >
                View
            </Button>
            <Button
                type="default"
                onClick={handleRemoveDate}
                disabled={isDisabled}
            >
                Delete
            </Button>
        </div>
    );
};

export default ViewEditActionBtns;
