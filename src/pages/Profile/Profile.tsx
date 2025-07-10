import { FiBook } from "react-icons/fi";
import { TbSchool } from "react-icons/tb";
import { ProfileWhyPM } from "../../components/Profile/ProfileWhyPM";
import ProfileEvents from "../../components/Profile/ProfileEvents";
import styled from "styled-components";
import { useUserData } from "../../providers/UserData/UserDataProvider";

const ProfileContainer = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const ProfileSpaceAround = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
`;

const ProfilePictureContainer = styled.div`
  width: 15rem;
  height: 15rem;
  padding: 0.9rem;
  border-radius: 50%;
  border: 1px solid #333d6c;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const ProfilePicture = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  overflow: hidden;
`;

const PersonalInfoContainer = styled.div`
  width: 40%;
`;

const ProfileNamePronounsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
`;

const ProfilePill = styled.div`
  width: fit-content;
  height: fit-content;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  align-self: center;
  gap: 0.3rem;
  margin: 0.6rem 0;
  padding: 0.3rem 0.9rem 0.3rem 0.9rem;
  border: none;
  border-radius: 100rem;
  background-color: #333d6c;
  color: white;
`;

const ProfileText = styled.p`
  margin-block: 0;
`;

export function Profile() {
  const { user } = useUserData()

  return (
    user && (
      <ProfileContainer>
        <ProfileSpaceAround>
          <ProfilePictureContainer>
            <ProfilePicture src={user.pfp} alt={"Profile Picture"} />
          </ProfilePictureContainer>
          <PersonalInfoContainer>
            <ProfileNamePronounsContainer>
              <h2>
                {user.firstName} {user.lastName}
              </h2>
              <ProfileText>{user.pronouns}</ProfileText>
            </ProfileNamePronounsContainer>
            {user.university && (
              <div>
                <ProfilePill>
                  <TbSchool />
                  <ProfileText>{user.university}</ProfileText>
                </ProfilePill>
                <ProfilePill>
                  <FiBook />
                  <ProfileText>
                    Year {user.year}, {user.faculty}, {user.major}
                  </ProfileText>
                </ProfilePill>
              </div>
            )}
          </PersonalInfoContainer>
        </ProfileSpaceAround>
        <ProfileWhyPM />
        <ProfileEvents />
      </ProfileContainer>
    )
  );
}
