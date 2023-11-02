import {
  CLASS_FOR_TAG,
  MS_GET_USER_INFO,
  STORAGE_KEY,
  TWITTER_URL,
} from '../../../utils/constant';

const FOLLOW_YOU = 'Follows you';
const INTERVAL_MS = 2000;

const dataMap = new Map();

const fontColor = '#888';
const emphasizeColor = '#d2d2d2';

let intervalId = null;

//

const startProcess = () => {
  intervalId = setInterval(fetchAndAttach, INTERVAL_MS);
  fetchAndAttach();
};

const stopProcess = () => {
  clearInterval(intervalId);
  intervalId = null;
  const tags = document.querySelectorAll(`.${CLASS_FOR_TAG}`);
  tags.forEach((tag) => tag.remove());
};

const fetchAndAttach = async () => {
  console.log('fetchAndAttach');

  const usernames = getTwitterUserNames();
  const newUsernames = usernames.filter((name) => !dataMap.has(name));

  try {
    if (newUsernames.length > 0) {
      await getUserInfos(newUsernames);
    }
    attachInfoTag();
  } catch (error) {
    console.error(error);
  }
};

const getTwitterUserNames = () => {
  const contents = Array.from(
    document.querySelectorAll("[data-testid='cellInnerDiv']")
  );
  const cells = Array.from(
    document.querySelectorAll("[data-testid='UserCell']")
  );

  const elements = contents.concat(cells);
  const user = document.querySelector("[data-testid='UserName']");

  if (user) {
    elements.push(user);
  }

  const linkUrls = elements
    .map((element) =>
      Array.from(element.querySelectorAll('a'))
        .map((element) => element.href)
        .filter((url) => url.startsWith(TWITTER_URL))
    )
    .flat();

  const usernames = FromLinkUrlsToUsernames(linkUrls);
  return usernames;
};

const FromLinkUrlsToUsernames = (urls) => {
  const uniqueUsernames = new Set();

  for (let url of urls) {
    const parts = url.split('/');
    if (parts.length === 4) {
      uniqueUsernames.add(parts[parts.length - 1]);
    }
  }

  const usernames = Array.from(uniqueUsernames);
  return usernames;
};

const getFirstLeefNode = (tag) => {
  if (tag.children.length === 0) {
    return tag;
  }
  return getFirstLeefNode(tag.children[0]);
};

const setUserInfos = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    return;
  }
  data.forEach((value) => {
    dataMap.set(value.twitterusername, value);
  }, {});
};

const getUserInfos = async (names) => {
  return new Promise((resolve, reject) => {
    const msg = {
      action: MS_GET_USER_INFO,
      names,
    };
    chrome.runtime.sendMessage(msg, (response) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        setUserInfos(response);
        resolve('ok');
      }
    });
  });
};

const parseUsername = (textContent = '') => {
  const dotIdx = textContent.indexOf('·');
  let userName = textContent.substring(
    textContent.indexOf('@') + 1,
    dotIdx === -1 ? textContent.length : dotIdx
  );

  if (userName.endsWith(FOLLOW_YOU)) {
    userName = userName.slice(0, -FOLLOW_YOU.length);
  }
  return userName;
};

function attachInfoTag() {
  const selectedUserTag = document.querySelector("[data-testid='UserName']");
  if (selectedUserTag) {
    const userName = parseUsername(selectedUserTag.children[0]?.textContent);

    const matchedUser = dataMap.get(userName);
    const checkLastTag = selectedUserTag.querySelector(`.${CLASS_FOR_TAG}`);

    if (matchedUser) {
      if (checkLastTag) {
        checkLastTag.remove();
      }
      const newDiv = createInfo(matchedUser);
      selectedUserTag.appendChild(newDiv);
    }
  }

  const userNameTags = document.querySelectorAll("[data-testid='User-Name']");
  userNameTags.forEach((tag) => {
    const userName = parseUsername(tag.textContent);

    const matchedUser = dataMap.get(userName);
    const checkLastTag = tag.parentNode.querySelector(`.${CLASS_FOR_TAG}`);

    if (matchedUser && !checkLastTag) {
      const firstLeefNode = getFirstLeefNode(tag);

      firstLeefNode.style.color = '#7fbaee';
      const newDiv = createInfo(matchedUser);
      tag.parentNode.appendChild(newDiv);
    }
  });

  const userCellTags = document.querySelectorAll("[data-testid='UserCell']");
  userCellTags.forEach((tag) => {
    const aTag = tag.querySelectorAll('a')?.[1];
    if (!aTag) {
      return;
    }
    const targetTag = aTag.parentElement.parentElement;

    const userName = parseUsername(targetTag.textContent);

    const matchedUser = dataMap.get(userName);
    const checkLastTag = targetTag.parentNode.querySelector(
      `.${CLASS_FOR_TAG}`
    );

    if (matchedUser && !checkLastTag) {
      const firstLeefNode = getFirstLeefNode(targetTag);

      firstLeefNode.style.color = '#7fbaee';
      const newDiv = createInfo(matchedUser);

      const targetContainerWidth =
        targetTag.parentNode?.parentNode?.offsetWidth || 300;
      if (targetContainerWidth <= 280) {
        newDiv.children[newDiv.children.length - 1].remove();
      }
      targetTag.parentNode.appendChild(newDiv);
    }
  });
}

function createInfo(matchedUser) {
  const newDiv = document.createElement('div');

  newDiv.classList.add(CLASS_FOR_TAG);
  newDiv.style.display = 'flex';
  newDiv.style.alignItems = 'center';
  newDiv.style.gap = '2px';
  newDiv.style.fontFamily = 'TwitterChirp';

  const rankDisplay = matchedUser.rank
    ? `🏆 ${matchedUser.rank}`
    : '🏆 >2000  ';

  const costDisplay = matchedUser.cost
    ? `💎 ${parseFloat(matchedUser.cost).toFixed(4)} E  `
    : '💎 - E  ';

  const addressLink = createLink(
    `https://friend.tech/rooms/${matchedUser.address}`
  );
  const trophyAndPriceLink = createLink(
    `https://friendmex.com/?address=${matchedUser.address}`
  );

  const content = `${rankDisplay}  ${costDisplay}  📭 `;
  const addressShort = `${matchedUser.address.substring(
    0,
    6
  )}...${matchedUser.address.slice(-4)}`;

  const displayNode = createSpan(content);
  const addressNode = createSpan(addressShort);

  addressLink.appendChild(addressNode);
  trophyAndPriceLink.appendChild(displayNode);

  newDiv.appendChild(trophyAndPriceLink);
  newDiv.appendChild(addressLink);
  return newDiv;
}

function createLink(href) {
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.style.textDecoration = 'none';
  link.style.display = 'inline';

  link.addEventListener('mouseover', () => {
    Array.from(link.children).forEach((child) => {
      child.style.color = emphasizeColor;
    });
  });

  link.addEventListener('mouseout', () => {
    Array.from(link.children).forEach((child) => {
      child.style.color = fontColor;
    });
  });
  return link;
}

function createSpan(text, className = '') {
  const span = document.createElement('span');
  span.textContent = text;
  span.className = `${className}`;
  span.style.fontSize = '12px';
  span.style.color = fontColor;
  return span;
}

chrome.storage.local.get(STORAGE_KEY).then((values) => {
  if (values.hasOwnProperty(STORAGE_KEY) && values[STORAGE_KEY]) {
    setTimeout(startProcess, 300);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log(changes, namespace);
  for (let key in changes) {
    if (key === STORAGE_KEY) {
      const newValue = changes[key].newValue;
      if (newValue) {
        console.log('start interval');
        startProcess();
      } else {
        console.log('stop interval');
        stopProcess();
      }
    }
  }
});
