import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Universities, UserDataFromUser, UserDataFromUserSchema, years } from '../../types/User';
import { styled } from 'styled-components';
import { useInAppBrowser } from '../../utils';

const Content = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    gap: 1rem;
`;

const Group = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75rem;
`;

const Input = styled.input<{ width?: number; $error: boolean }>`
    border-radius: 999rem;
    padding: 0.5rem 0.75rem;
    flex: ${(props) => (props.width ? '' : 1)};
    width: ${(props) => props.width && props.width + '%'};
    font-family: 'poppins';

    &::placeholder {
        color: var(--pmc-midnight-blue);
    }

    border: ${(props) => props.$error && '0.2rem solid red'};
    @media (max-width: 600px) {
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
`;

const Dropdown = styled.select<{ width?: number; $error: boolean }>`
    border-radius: 999rem;
    padding: 0.5rem 0.75rem;
    flex: 1;
    width: ${(props) => props.width && props.width + '%'};
    font-family: 'poppins';

    &::placeholder {
        color: var(--pmc-midnight-blue);
    }

    border: ${(props) => props.$error && '0.2rem solid red'};
    @media (max-width: 600px) {
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
`;

const TextArea = styled.textarea<{ $error: boolean }>`
    border-radius: 1rem;
    padding: 0.5rem 0.75rem;
    resize: none;

    &::placeholder {
        font-family: 'poppins';
        color: var(--pmc-midnight-blue);
    }

    border: ${(props) => props.$error && '0.2rem solid red'};
    @media (max-width: 600px) {
        width: 100%;
        margin: 0 auto;
        box-sizing: border-box;
    }
`;

const Waiver = styled.div`
    color: white;
    margin: 0;
`;
const WaiverLink = styled.a`
    color: white;
`;
const Submit = styled.button`
    cursor: pointer;
    font-family: poppins;
    font-weight: 600;
    margin-left: auto;
    padding: 0.5rem 2rem;
    border-radius: 0.5rem;
    color: var(--pmc-midnight-blue);
`;

type UserDataFormProps = {
    responses: Partial<UserDataFromUser>;
    onSubmit: (data: UserDataFromUser) => void;
    hasWaiver?: boolean;
    buttonText?: string;
};

export function UserDataForm({
    responses,
    onSubmit,
    hasWaiver,
    buttonText = 'Continue',
}: UserDataFormProps) {
    const form = useForm({
        resolver: zodResolver(UserDataFromUserSchema),
    });

    const university = form.watch('university');

    const isStudent: boolean = university && university !== Universities[4];
    const isUbcStudent: boolean = isStudent && university === Universities[0];
    const { isInAppBrowser, isMobile } = useInAppBrowser();
    console.log(isMobile);

    useEffect(() => {
        // if not a ubc student
        if (university !== Universities[0]) {
            form.unregister('studentId');
        }
        // if not a student
        if (university === Universities[4]) {
            form.unregister('faculty');
            form.unregister('year');
            form.unregister('major');
        }
    }, [university]);

    return (
        <>
            {isMobile || isInAppBrowser ? (
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <Content>
                        <Input
                            placeholder="First name"
                            defaultValue={responses.firstName}
                            width={40}
                            required
                            {...form.register('firstName')}
                            $error={!!form.formState.errors.firstName}
                        />
                        <Input
                            placeholder="Last name"
                            defaultValue={responses.lastName}
                            width={40}
                            required
                            {...form.register('lastName')}
                            $error={!!form.formState.errors.lastName}
                        />
                        <Input
                            placeholder="Pronouns"
                            defaultValue={responses.pronouns}
                            width={20}
                            required
                            {...form.register('pronouns')}
                            $error={!!form.formState.errors.pronouns}
                        />
                        <Dropdown
                            data-testid="university-dropdown"
                            required
                            {...form.register('university', { required: 'please select a value' })}
                            $error={!!form.formState.errors.university}
                            defaultValue={responses.university}
                        >
                            <option value="" hidden>
                                What university do you go to?
                            </option>
                            {Universities.map((uni) => {
                                return (
                                    <option value={uni} key={uni}>
                                        {uni}
                                    </option>
                                );
                            })}
                        </Dropdown>
                        {isUbcStudent && (
                            <Input
                                placeholder="Student ID"
                                defaultValue={responses.studentId}
                                required
                                {...form.register('studentId')}
                                $error={!!form.formState.errors.studentId}
                            />
                        )}
                        {isStudent && (
                            <>
                                <Input
                                    placeholder="Faculty"
                                    defaultValue={responses.faculty}
                                    required
                                    {...form.register('faculty')}
                                    $error={!!form.formState.errors.faculty}
                                />
                                <Input
                                    placeholder="Major"
                                    defaultValue={responses.major}
                                    required
                                    {...form.register('major')}
                                    $error={!!form.formState.errors.major}
                                />
                                <Dropdown
                                    data-testid="year-dropdown"
                                    defaultValue={responses.year}
                                    required
                                    {...form.register('year')}
                                    $error={!!form.formState.errors.year}
                                >
                                    <option value="" hidden>
                                        Year
                                    </option>
                                    {years.map((year) => {
                                        return (
                                            <option value={year} key={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </Dropdown>
                                <TextArea
                                    placeholder="Why Product Management?"
                                    defaultValue={responses.whyPm}
                                    rows={5}
                                    required
                                    {...form.register('whyPm')}
                                    $error={!!form.formState.errors.whyPm}
                                />

                                {hasWaiver && isUbcStudent && (
                                    <Waiver>
                                        <div>
                                            Please sign the following form:
                                            <WaiverLink
                                                href="https://www.ams.ubc.ca/student-life/clubs/operating-a-club/club-constituency-general-membership-waiver/"
                                                target="_blank"
                                            >
                                                {' '}
                                                Insurance/Liability Waiver.
                                            </WaiverLink>
                                        </div>
                                        <div>
                                            I have signed the Insurance/Liability Waiver form.&nbsp;
                                            <input type="checkbox" required />
                                        </div>
                                    </Waiver>
                                )}

                                <Submit type="submit">{buttonText}</Submit>
                            </>
                        )}
                    </Content>
                </form>
            ) : (
                <form autoComplete="off" onSubmit={form.handleSubmit(onSubmit)}>
                    <Content>
                        <Group>
                            <Input
                                placeholder="First name"
                                defaultValue={responses.firstName}
                                width={40}
                                required
                                {...form.register('firstName')}
                                $error={!!form.formState.errors.firstName}
                            />
                            <Input
                                placeholder="Last name"
                                defaultValue={responses.lastName}
                                width={40}
                                required
                                {...form.register('lastName')}
                                $error={!!form.formState.errors.lastName}
                            />
                            <Input
                                placeholder="Pronouns"
                                defaultValue={responses.pronouns}
                                width={20}
                                required
                                {...form.register('pronouns')}
                                $error={!!form.formState.errors.pronouns}
                            />
                        </Group>

                        <Dropdown
                            data-testid="university-dropdown"
                            required
                            {...form.register('university', { required: 'please select a value' })}
                            $error={!!form.formState.errors.university}
                            defaultValue={responses.university}
                        >
                            <option value="" hidden>
                                What university do you go to?
                            </option>
                            {Universities.map((uni) => {
                                return (
                                    <option value={uni} key={uni}>
                                        {uni}
                                    </option>
                                );
                            })}
                        </Dropdown>

                        {isUbcStudent && (
                            <Group>
                                <Input
                                    placeholder="Student ID"
                                    defaultValue={responses.studentId}
                                    required
                                    {...form.register('studentId')}
                                    $error={!!form.formState.errors.studentId}
                                />
                            </Group>
                        )}

                        {isStudent && (
                            <Group>
                                <Input
                                    placeholder="Faculty"
                                    defaultValue={responses.faculty}
                                    width={45}
                                    required
                                    {...form.register('faculty')}
                                    $error={!!form.formState.errors.faculty}
                                />
                                <Input
                                    placeholder="Major"
                                    defaultValue={responses.major}
                                    width={45}
                                    required
                                    {...form.register('major')}
                                    $error={!!form.formState.errors.major}
                                />
                                <Dropdown
                                    data-testid="year-dropdown"
                                    defaultValue={responses.year}
                                    required
                                    {...form.register('year')}
                                    $error={!!form.formState.errors.year}
                                >
                                    <option value="" hidden>
                                        Year
                                    </option>
                                    {years.map((year) => {
                                        return (
                                            <option value={year} key={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </Dropdown>
                            </Group>
                        )}

                        <TextArea
                            placeholder="Why Product Management?"
                            defaultValue={responses.whyPm}
                            rows={5}
                            required
                            {...form.register('whyPm')}
                            $error={!!form.formState.errors.whyPm}
                        />

                        {hasWaiver && isUbcStudent && (
                            <Waiver>
                                <div>
                                    Please sign the following form:
                                    <WaiverLink
                                        href="https://www.ams.ubc.ca/student-life/clubs/operating-a-club/club-constituency-general-membership-waiver/"
                                        target="_blank"
                                    >
                                        {' '}
                                        Insurance/Liability Waiver.
                                    </WaiverLink>
                                </div>
                                <div>
                                    I have signed the Insurance/Liability Waiver form.&nbsp;
                                    <input type="checkbox" required />
                                </div>
                            </Waiver>
                        )}

                        <Submit type="submit">{buttonText}</Submit>
                    </Content>
                </form>
            )}
        </>
    );
}
