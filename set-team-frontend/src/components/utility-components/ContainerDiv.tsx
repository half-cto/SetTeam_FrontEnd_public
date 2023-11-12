import { PropsWithChildren } from 'react';

export type DivStyles = 'landing-container' | 'form-conainer';

interface ContainerDivProps {
    divType: DivStyles;
}

const ContainerDiv = ({
    divType,
    children,
}: PropsWithChildren<ContainerDivProps>) => {
    let divClass = '';

    switch (divType) {
        case 'landing-container':
            divClass = 'p-5 flex flex-col font-robotoMono pt-20vh z-20';
            break;
        case 'form-conainer':
            divClass =
                'bg-opacity-70 m-auto flex-col justify-center p-10 rounded-md max-w-lg font-robotoMono z-20';
            break;
        default:
            break;
    }
    return <div className={divClass}>{children}</div>;
};

export default ContainerDiv;
