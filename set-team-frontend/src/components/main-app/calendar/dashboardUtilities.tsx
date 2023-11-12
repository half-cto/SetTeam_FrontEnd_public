// filter user projects from getAllProjects response

export function filterUserProjects(
    projects: Project[] | undefined,
    userName: string | undefined
): Project[] {
    if (projects && userName) {
        const filteredProjects = projects.filter(
            (proj) => proj.ownerId === userName
        );
        return filteredProjects;
    }
    return [];
}

// add random colour to project for rendering in calendar

interface ProjectForRender extends Project {
    projColor: string;
}

const accentColors = [
    'red',
    'orange',
    'yellow',
    'lime',
    'emerald',
    'cyan',
    // 'indigo',
];

// add colour to projects

export function addProjectBgColor(proj: Project[]): ProjectForRender[] {
    return proj.map((entry, i): ProjectForRender => {
        const colorIndex =
            i > accentColors.length - 1 ? i % accentColors.length : i;

        return { ...entry, projColor: accentColors[colorIndex] };
    });
}
