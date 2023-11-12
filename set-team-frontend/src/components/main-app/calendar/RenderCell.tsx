import { Dayjs } from 'dayjs';
import { Link } from 'react-router-dom';
import { ProjectsOnDate } from '../../../store/apis/projectsApi';
import classNames from 'classnames';

// render calendar cell wiht projects
export function RenderCell(
    date: Dayjs,
    renderData: ProjectsOnDate[],
    userId: string
): JSX.Element {
    const cellDate = date.format('YYYY-MM-DD');

    const dateProjects = renderData.find((el) => el[cellDate]);

    if (dateProjects) {
        return (
            <>
                {dateProjects[cellDate].map((proj) => {
                    const isOwner = proj.SK.startsWith(userId);
                    const projDivClassNames = classNames(
                        'flex justify-center py-1 rounded-md font-robotoMono text-sm text-center',
                        `hover:bg-${proj.projBgColor}-300`,
                        `border-4 border-${proj.projBgColor}-400`,
                        {
                            [`bg-${proj.projBgColor}-400`]: isOwner,
                        }
                    );

                    const renderedCell = isOwner ? (
                        <Link
                            to={`/project/${proj.SK}`}
                            key={proj.SK + cellDate}
                        >
                            <div className={projDivClassNames}>{proj.name}</div>
                        </Link>
                    ) : (
                        <div
                            className={projDivClassNames}
                            key={proj.SK + cellDate}
                        >
                            {proj.name}
                        </div>
                    );
                    return <div key={proj.SK + cellDate}>{renderedCell}</div>;
                })}
            </>
        );
    }

    return <></>;
}
