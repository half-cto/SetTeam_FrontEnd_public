import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import dayjs from 'dayjs';
import { MDisplayPage } from '../../components/mobile-app/MDashboard';

type ActiveDate = {
    activeDate: string | undefined;
};

type DisplayPage = {
    displayPage: MDisplayPage;
};

type ActiveData = ActiveDate &
    DisplayPage & {
        activeProjectId: string | undefined;
    };

type CalMonth = {
    calMonth: string;
};

type MobileStatePops = ActiveData & CalMonth;

const activeDataSlice = createSlice({
    name: 'activeData',
    initialState: {
        displayPage: 'calendar',
        activeDate: undefined,
        activeProjectId: undefined,
        calMonth: dayjs().format('YYYY-MM-DD'),
    } as MobileStatePops,
    reducers: {
        setActiveData(
            state,
            {
                payload: { activeDate, activeProjectId, displayPage },
            }: PayloadAction<ActiveData>
        ) {
            state.activeDate = activeDate;
            state.activeProjectId = activeProjectId;
            state.displayPage = displayPage;
        },
        updateCalMonth(
            state,
            { payload: { calMonth } }: PayloadAction<CalMonth>
        ) {
            state.calMonth = calMonth;
        },
        updateActiveDate(
            state,
            { payload: { activeDate } }: PayloadAction<ActiveDate>
        ) {
            state.activeDate = activeDate;
        },
        updateDisplayPage(
            state,
            { payload: { displayPage } }: PayloadAction<DisplayPage>
        ) {
            state.displayPage = displayPage;
        },
        updateActiveDateAndPage(
            state,
            {
                payload: { activeDate, displayPage },
            }: PayloadAction<ActiveDate & DisplayPage>
        ) {
            state.activeDate = activeDate;
            state.displayPage = displayPage;
        },
    },
});

export const {
    setActiveData,
    updateCalMonth,
    updateActiveDate,
    updateDisplayPage,
    updateActiveDateAndPage,
} = activeDataSlice.actions;
export const activeData = activeDataSlice.reducer;
