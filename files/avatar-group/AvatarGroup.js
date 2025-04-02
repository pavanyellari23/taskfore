import React, { useEffect , useState } from 'react';
import PropTypes from 'prop-types';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import SnapAvatar from '@pnp-snap/snap-avatar';
import styles from './AvatarGroup.module.scss';

const AvatarGroup = ({ avatarData, maxAvatarsToShow }) => {
  const [maxNumberAvatarsToShow , setMaxNumberAvatarsToShow] = useState(0);
  const [avatarsToShow , setAvatarsToShow] = useState(0);
  const [remainingAvatars , setRemainingAvatars] = useState(0);

  useEffect(() => {
    setMaxNumberAvatarsToShow(maxAvatarsToShow);
    setAvatarsToShow(avatarData.slice(0, maxNumberAvatarsToShow));
    setRemainingAvatars(avatarData.slice(maxNumberAvatarsToShow));  
  }, [avatarData, maxAvatarsToShow, maxNumberAvatarsToShow]);

  return (
    <>
      {avatarData && 
      <div
        className={`d-flex align-items-center justify-content-center ${styles.wrapper}`}
      >
        {avatarsToShow && avatarsToShow?.map((avatarGroupList, index) => {
          return (
            <SnapTooltip
              className={`main-tooltip ${styles['avatar-info-tooltip']}`}
              content={
                <>{`${avatarGroupList.firstName}`}</>
              }
              key={avatarGroupList?.id}
            >
              <div
                className={styles['avatar-wrapper']}
                style={{ zIndex: maxAvatarsToShow - index }}
              >
                <SnapAvatar
                  firstName={avatarGroupList?.firstName}
                  key={avatarGroupList?.id}
                  lastName={avatarGroupList?.lastName}
                  src={avatarGroupList?.src}
                  variant="circle"
                />
              </div>
            </SnapTooltip>
          );
        })}
        {remainingAvatars.length > 0 && (
          <SnapTooltip
            className={`main-tooltip ${styles['remaining-avatar-info-tooltip']}`}
            content={
              <ul>
                {remainingAvatars.map((avatar, index) => (
                  <li 
                    className="d-flex align-items-center"
                    key={avatar?.id}
                  >
                    <SnapAvatar
                      className={styles['avatar-img']}
                      colorIndex={index%10}
                      firstName={avatar?.firstName}
                      lastName={avatar?.lastName}
                      randomize
                      src={avatar?.src}
                      variant="circle" 
                    />
                    <span>{`${avatar.firstName} ${avatar?.lastName || ''}`}</span>
                  </li>
                ))}
              </ul>
            }
          >
            <div
              className={`d-flex align-items-center justify-content-center ${
                styles['remaining-avatars']
              } ${
                remainingAvatars.length > 10 ? styles['decrease-text-size'] : ''}`}
            >
              {`+${remainingAvatars.length}`}
            </div>
          </SnapTooltip>
        )}
      </div>
      }
    </>
  );
};

AvatarGroup.propTypes = {
  avatarData: PropTypes.object,
  maxAvatarsToShow: PropTypes.number
};

export default AvatarGroup;
