import { Calendar, ConfigProvider, Spin } from 'antd';
import { useState } from 'react';
import AddProjectModal from './AddProjectModal';
import { useFetchCalProjectsQuery } from '../../../store/store';

import { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { RenderCell } from './RenderCell';
import { SelectInfo } from 'antd/es/calendar/generateCalendar';
import { getCredentialsFromLocalStorage } from '../../../utils/functions';

function Dashboard() {
    const [queryDate, setQueryDate] = useState(dayjs());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState(dayjs());

    const { userName: userId } = getCredentialsFromLocalStorage();

    const { data: renderData } = useFetchCalProjectsQuery({
        userId,
        date: queryDate.format('YYYY-MM-DD'),
    });

    const handleCellRender = (date: Dayjs) => {
        if (renderData) {
            return RenderCell(date, renderData, userId);
        }
    };

    const handlePanelChange = (date: Dayjs) => {
        setQueryDate(date);
    };

    const handleDateSelect = (date: Dayjs, selectInfo: SelectInfo) => {
        setSelectedDate(date);
        if (selectInfo.source === 'date') setIsModalOpen(true);
        //console.log(selectedDate.format('YYYY-MM-DD'));
    };

    const renderedCalendar = renderData ? (
        <>
            <Calendar
                cellRender={handleCellRender}
                onPanelChange={handlePanelChange}
                onSelect={handleDateSelect}
            />
        </>
    ) : (
        <>
            <div className="flex justify-center">
                <Spin size="large" />
            </div>
        </>
    );
    return (
        <div className="max-w-screen-xl m-auto">
            <ConfigProvider
                theme={{
                    token: {
                        fontFamily: 'Roboto Mono',
                    },
                }}
            >
                <div className="h-2">
                    {isModalOpen && (
                        <AddProjectModal
                            isOpen={isModalOpen}
                            setIsOpen={setIsModalOpen}
                            selectedDate={selectedDate}
                        />
                    )}
                </div>
                <div className="p-2 rounded-md  bg-orange-100 shadow-xl">
                    <div className="p-4 rounded-md bg-white">
                        {renderedCalendar}
                    </div>
                </div>
            </ConfigProvider>
        </div>
    );
}

export default Dashboard;
