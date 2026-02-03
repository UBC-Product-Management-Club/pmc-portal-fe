import React from 'react';

const CardsWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex h-[66vh] w-full max-w-full gap-6 max-md:flex-col">{children}</div>
);

const CardVerticalWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-1 flex-col gap-6">{children}</div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="flex min-w-0 flex-1 flex-col rounded-xl border border-[rgba(141,155,235,0.2)] bg-pmc-midnight-blue shadow-[0_10px_15px_-3px_rgba(0,0,0,0.3)]">
        {children}
    </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-between px-6 pb-0 pt-2">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-base font-semibold text-[#7f838f]">{children}</h2>
);

const CardContent = ({ children, center }: { children: React.ReactNode; center?: boolean }) => (
    <div
        className={`flex min-h-0 flex-1 flex-col overflow-y-auto px-6 pb-4 ${
            center ? 'h-[150px] items-center justify-center text-center' : ''
        }`}
    >
        {children}
    </div>
);

const CountdownNumbers = ({ children }: { children: React.ReactNode }) => (
    <div className="flex w-full justify-between gap-4">{children}</div>
);

const TimeBlock = ({ children }: { children: React.ReactNode }) => (
    <div className="flex flex-1 flex-col items-center">{children}</div>
);

const TimeValue = ({ children }: { children: React.ReactNode }) => (
    <span className="text-4xl font-bold text-white">{children}</span>
);

const TimeLabel = ({ children }: { children: React.ReactNode }) => (
    <span className="text-sm uppercase text-pmc-light-grey">{children}</span>
);

const CountdownText = ({ children }: { children: React.ReactNode }) => (
    <p className="mb-1 text-center text-sm font-medium text-pmc-light-grey">{children}</p>
);

export {
    CardsWrapper,
    CardVerticalWrapper,
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CountdownNumbers,
    TimeBlock,
    TimeValue,
    TimeLabel,
    CountdownText,
};
