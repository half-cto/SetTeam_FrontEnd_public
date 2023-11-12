import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import {
    RootState,
    updateActiveDate,
    useFetchProjByIdQuery,
} from '../../../store/store';

const { Title } = Typography;

const ProjDateSwitcher = () => {
    const { activeDate, activeProjectId } = useSelector(
        (state: RootState) => state.activeData
    );

    const { data: project } = useFetchProjByIdQuery({
        projId: activeProjectId as string,
    });
    const dispatch = useDispatch();

    // TODO move date switching to <MProjectDate/>
    const handleProjDateChange = (valueToAdd: number) => {
        if (project && activeDate) {
            const currentDateIndex = project.projDates.indexOf(activeDate);
            const nextDateIndex =
                currentDateIndex + valueToAdd === project.projDates.length
                    ? 0
                    : currentDateIndex + valueToAdd;

            dispatch(
                updateActiveDate({
                    activeDate: project.projDates.at(nextDateIndex),
                })
            );
        }
    };

    return (
        <div className="flex gap-1 w-full justify-between px-4 pt-2">
            <Button
                icon={<CaretLeftOutlined />}
                onClick={() => handleProjDateChange(-1)}
                className="shadow-md"
            />
            <Title level={4}>
                {dayjs(activeDate, 'YYYY-MM-DD').format('DD MMM')}
            </Title>

            <Button
                icon={<CaretRightOutlined />}
                onClick={() => handleProjDateChange(1)}
                className="shadow-md"
            />
        </div>
    );
};

export default ProjDateSwitcher;
