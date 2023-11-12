import classNames from 'classnames';

export interface CallbackProps {
    date: string;
    userId: string;
    status: string | undefined;
}

interface TCellProps {
    userId: string;
    rowDate: string;
    projectId: string;
    value: {
        cellId: string;
        callback: ({ date, userId, status }: CallbackProps) => Promise<void>;
        status: string | undefined;
    };
    index: number;
}

const TCell = ({
    userId,
    projectId,
    rowDate,

    value: { cellId: _cellid, callback, status },
}: TCellProps) => {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    const handleClick: React.MouseEventHandler<HTMLDivElement> = async () => {
        await callback({ date: rowDate, userId, status });
    };

    const cellType =
        status === projectId
            ? 'onTeam'
            : status === 'available' || status === undefined
            ? 'available'
            : 'busy';
    const cellClasses = classNames(
        `rounded h-6 w-20 mx-auto drop-shadow-lg active:drop-shadow-none border-4`,
        {
            'border-green-600 cursor-pointer': cellType === 'available',
            'border-green-600 bg-green-600 cursor-pointer':
                cellType === 'onTeam',
            'border-gray-400 bg-gray-400': cellType === 'busy',
        }
    );

    return (
        <div
            className={cellClasses}
            id={userId + '-' + projectId}
            onClick={handleClick}
        ></div>
    );
};

export default TCell;
