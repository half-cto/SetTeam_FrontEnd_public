import { AnyAction, Dispatch } from '@reduxjs/toolkit';
import { ProjectsOnDate } from '../../store/apis/projectsApi';
import {
    getCredentialsFromLocalStorage,
    sortDates,
} from '../../utils/functions';
import { setActiveData } from '../../store/store';
import classNames from 'classnames';

// renders dates with projects for display in Calendar view

export function renderMobileCalendar(
    renderData: ProjectsOnDate[],
    calMonth: string,
    dispatch: Dispatch<AnyAction>
) {
    const renderedDates: JSX.Element[] = [];

    // get and sort all dates that have projects
    const dateKeys = sortDates(
        renderData
            .flatMap((value) => Object.keys(value))
            .filter((date) => date.slice(5, 7) === calMonth)
    );

    const { userName } = getCredentialsFromLocalStorage();

    dateKeys.forEach((date) => {
        const dateProjects = renderData.find((entry) => entry[date]);
        if (dateProjects) {
            //console.log(i, dateProjects[date], typeof dateProjects);
            const projectsToRender = dateProjects[date];

            renderedDates.push(
                <div
                    key={date}
                    className="flex gap-3 font-robotoMono w-full pt-2"
                >
                    <h2 className=" text-xl">{date.slice(8)}</h2>
                    <div className="flex-auto">
                        {projectsToRender.map((project) => {
                            const projDateClass = classNames(
                                'border-4 rounded text-center p-1 mb-1 shadow-md',
                                `border-${project.projBgColor}-200`,
                                {
                                    [`bg-${project.projBgColor}-200`]:
                                        project.SK.startsWith(userName),
                                    'active:shadow-none':
                                        project.SK.startsWith(userName),
                                }
                            );
                            return (
                                <div
                                    onClick={() => {
                                        if (project.SK.startsWith(userName)) {
                                            dispatch(
                                                setActiveData({
                                                    activeDate: date,
                                                    activeProjectId: project.SK,
                                                    displayPage: 'project',
                                                })
                                            );
                                        }
                                    }}
                                    key={date + project.SK}
                                    className={projDateClass}
                                >
                                    <h2>{project.name}</h2>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    });
    return renderedDates;
}
