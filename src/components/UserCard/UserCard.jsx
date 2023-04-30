import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { UserCardStyled } from './UserCard.styled';
import { mockapiTest_API } from 'API/mockapiTest_API';
import logo from '../../data/img/Logo.png';
import cardTweetImg from '../../data/img/userCardBg.png';
import userAvatar from '../../data/img/userAvatar.png';
import { Button } from 'components/GlobalStyle';
import { theme } from 'utils/constants/theme';

const UserCard = ({
  user: { tweets, followers, user, avatar, id },
  changeDisplayedUsers,
}) => {
  const storedFollowings = JSON.parse(
    localStorage.getItem('following') ?? '[]'
  );
  const isIdStored = storedFollowings.indexOf(id) !== -1;
  const [isFollowed, setIsFollowed] = useState(isIdStored);
  const [followersNumber, setFollowersNumber] = useState(followers);
  const followButtonRef = useRef();

  async function onFollowButtonClick(event) {
    event.preventDefault();
    //!Follow
    if (!isFollowed) {
      setIsFollowed(true);

      try {
        await mockapiTest_API.editUser(id, {
          tweets,
          user,
          avatar,
          id,
          followers: followersNumber + 1,
        });
      } catch (error) {
        console.log(error);
      }
      setFollowersNumber(prev => ++prev);

      //changing followed user card button bgcolor
      followButtonRef.current.style.backgroundColor = theme.colors.accent;

      //saving followed user id to localstorage
      localStorage.setItem(
        'following',
        JSON.stringify([
          ...JSON.parse(localStorage.getItem('following') ?? '[]'),
          id,
        ])
      );
      changeDisplayedUsers({ id, action: 'follow' });
    }

    //!Unfollow
    if (isFollowed) {
      setIsFollowed(false);
      try {
        await mockapiTest_API.editUser(id, {
          tweets,
          user,
          avatar,
          id,
          followers: followersNumber - 1,
        });
      } catch (error) {
        console.log(error);
      }
      setFollowersNumber(prev => --prev);

      //changing unfollowed user card button bgcolor
      followButtonRef.current.style.backgroundColor = theme.colors.white;

      //deleting unfollowed user id from localstorage
      localStorage.setItem(
        'following',
        JSON.stringify(
          JSON.parse(localStorage.getItem('following') ?? '[]').filter(
            el => el !== id
          )
        )
      );
      changeDisplayedUsers({ id, action: 'unfollow' });
    }
  }

  useEffect(() => {
    if (isFollowed) {
      followButtonRef.current.style.backgroundColor = theme.colors.accent;
    }
  }, [isFollowed]);

  return (
    <UserCardStyled className="userCard">
      <img src={logo} className="userCard__logo" alt="logo"></img>
      <img
        src={cardTweetImg}
        className="userCard__tweetImg"
        alt=" two
        tweet
        clouds
        with
        question
        and
        check"
      ></img>
      <div className="userCard__line"></div>

      <div className="userCard__ellipse" alt="ellipse around avatar">
        <img src={userAvatar} className="userCard__avatar" alt="user avatar" />
      </div>

      <p className="userCard__tweets">{transformNumber(tweets)} tweets</p>
      <p className="userCard__followers">
        {transformNumber(followersNumber)} followers
      </p>
      <Button
        type="button"
        title="add user to followings"
        className="userCard__followButton"
        onClick={onFollowButtonClick}
        ref={followButtonRef}
      >
        {isFollowed ? 'Following' : 'Follow'}
      </Button>
    </UserCardStyled>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    tweets: PropTypes.number.isRequired,
    followers: PropTypes.number.isRequired,
    user: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
  }).isRequired,
  changeDisplayedUsers: PropTypes.func.isRequired,
};

export default UserCard;

function transformNumber(number) {
  const stringNumber = String(number);
  return number > 1000
    ? `${stringNumber.slice(0, stringNumber.length - 3)},${stringNumber.slice(
        -3
      )}`
    : `${stringNumber.slice(-3)}`;
}
