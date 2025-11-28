import { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CountdownNumbers,
    CountdownText,
    TimeBlock,
    TimeValue,
    TimeLabel,
} from './utils';
import { HEIST_END, HEIST_START } from '../../utils';

type Phase = 'before' | 'during' | 'after';

export const TimelineCard = () => {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [phase, setPhase] = useState<Phase>('before');

    useEffect(() => {
        const update = () => {
            const now = Date.now();

            if (now < HEIST_START) {
                setPhase('before');
                const diff = HEIST_START - now;
                setTimeLeft(msToTime(diff));
            } else if (now < HEIST_END) {
                setPhase('during');
                const diff = HEIST_END - now;
                setTimeLeft(msToTime(diff));
            } else {
                setPhase('after');
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
                <CountdownText>
                    {phase === 'before'
                        ? 'Heist starts in...'
                        : phase === 'during'
                          ? 'Heist ends in...'
                          : 'Heist complete - submissions closed'}
                </CountdownText>

                <CountdownNumbers>
                    <TimeBlock>
                        <TimeValue>{timeLeft.hours}</TimeValue>
                        <TimeLabel>hours</TimeLabel>
                    </TimeBlock>
                    <TimeBlock>
                        <TimeValue>{timeLeft.minutes}</TimeValue>
                        <TimeLabel>minutes</TimeLabel>
                    </TimeBlock>
                    <TimeBlock>
                        <TimeValue>{timeLeft.seconds}</TimeValue>
                        <TimeLabel>seconds</TimeLabel>
                    </TimeBlock>
                </CountdownNumbers>
            </CardContent>
        </Card>
    );
};

function msToTime(diff: number) {
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return { hours, minutes, seconds };
}
