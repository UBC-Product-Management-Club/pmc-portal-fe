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
import { getEventTimestamps } from '../../utils';
import { useEvents } from '../../hooks/useEvents';

type Phase = 'before' | 'during' | 'after';

type TimelineCardProps = {
    eventId: string;
};

export const TimelineCard = ({ eventId }: TimelineCardProps) => {
    const { getById } = useEvents();
    const [phase, setPhase] = useState<Phase>('before');
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

    const [times, setTimes] = useState<{ start: number; end: number } | null>(null);

    useEffect(() => {
        (async () => {
            const event = await getById(eventId);
            setTimes(getEventTimestamps(event));
        })();
    }, [getById]);

    useEffect(() => {
        if (!times) return;

        const update = () => {
            const now = Date.now();
            const { start, end } = times;

            if (now < start) {
                setPhase('before');
                setTimeLeft(msToTime(start - now));
            } else if (now < end) {
                setPhase('during');
                setTimeLeft(msToTime(end - now));
            } else {
                setPhase('after');
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
            }
        };

        update();
        const interval = setInterval(update, 1000);
        return () => clearInterval(interval);
    }, [times]);

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
