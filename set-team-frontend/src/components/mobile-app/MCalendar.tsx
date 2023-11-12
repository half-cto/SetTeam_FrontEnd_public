import { updateDisplayPage, useFetchCalProjectsQuery } from '../../store/store';
import { renderMobileCalendar } from './mUtilties';
import { FloatButton } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface MCalendarProps {
    userId: string;
}

const MCalendar = ({ userId }: MCalendarProps) => {
    const calMonth = useSelector(
        (state: RootState) => state.activeData.calMonth
    );

    const { data: calProjects } = useFetchCalProjectsQuery({
        userId,
        date: calMonth,
    });

    const dispatch = useDispatch();

    const handleAddNewProject = () => {
        dispatch(updateDisplayPage({ displayPage: 'createProject' }));
    };

    // TODO add loading spinner while redux is fetching data

    return (
        <div className="flex flex-col gap-2 p-2 mt-14">
            {calProjects &&
                renderMobileCalendar(
                    calProjects,
                    calMonth.slice(5, 7),
                    dispatch
                )}
            <FloatButton
                icon={<PlusOutlined />}
                type="primary"
                onClick={handleAddNewProject}
            />
        </div>
    );
};

export default MCalendar;
