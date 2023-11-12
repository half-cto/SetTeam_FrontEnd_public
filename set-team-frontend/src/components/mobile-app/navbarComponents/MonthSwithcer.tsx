import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons';
import { Button, Typography } from 'antd';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, updateCalMonth } from '../../../store/store';

const { Title } = Typography;

const MonthSwitcher = () => {
    const calMonth = useSelector(
        (state: RootState) => state.activeData.calMonth
    );
    const calMonthDaysJs = dayjs(calMonth, 'YYYY-MM-DD');
    const dispatch = useDispatch();

    const handleMonthChange = (valueToAdd: number) => {
        const newCalMonth = calMonthDaysJs.add(valueToAdd, 'month');
        dispatch(
            updateCalMonth({ calMonth: newCalMonth.format('YYYY-MM-DD') })
        );
    };

    return (
        <div className="flex gap-1 ">
            <Button
                icon={<CaretLeftOutlined />}
                onClick={() => handleMonthChange(-1)}
            />

            <Title
                level={3}
                className="px-2"
            >
                {calMonthDaysJs.format('MMMM')}
            </Title>
            <Button
                icon={<CaretRightOutlined />}
                onClick={() => handleMonthChange(1)}
            />
        </div>
    );
};

export default MonthSwitcher;
