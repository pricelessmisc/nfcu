/**
 * Author: Maximo Mena
 * GitHub: mmenavas
 * Twitter: @menamaximo
 * Project: Memory Workout
 * Description: The game interface
 */

/**
 * Card values
 * 
 * card-1 = auto.jpg
 * card-2 = creditcard.jpg
 * card-3 = making.jpg
 * card-4 = mobile.jpg
 */
(function ($) {

  /************ Start hard coded settings ******************/

  // How long a non matching card is displayed once clicked.
  var nonMatchingCardTime = 1000;

  // Shuffle card images: How many different images are available to shuffle
  // from?
  var imagesAvailable = 4;

  // Sets the modal timer so we can clear it globally
  var resetModalTimer;

  /************ End hard coded settings ******************/

  // Handle clicking on settings icon
  var settings = document.getElementById('memory--settings-icon');
  var modal = document.getElementById('memory--settings-modal');
  var handleOpenSettings = function (event) {
    event.preventDefault();
    modal.classList.toggle('show');
  };
  settings.addEventListener('click', handleOpenSettings);

  // Handle settings form submission
  var reset = document.getElementById('memory--settings-reset');
  var handleSettingsSubmission = function (event) {
    event.preventDefault();

    // var selectWidget = document.getElementById("memory--settings-grid").valueOf();
    // var grid = selectWidget.options[selectWidget.selectedIndex].value;
    var grid = "2x3"; // Manuall set for now as we have removed the options to choose.

    var gridValues = grid.split('x');
    var cards = $.initialize(Number(gridValues[0]), Number(gridValues[1]), imagesAvailable);

    if (cards) {
      document.getElementById('memory--settings-modal').classList.remove('show');
      document.getElementById('memory--end-game-modal').classList.remove('show');
      document.getElementById('memory--end-game-message').innerText = "";
      document.getElementById('memory--end-game-score').innerText = "";
      buildLayout($.cards, $.settings.rows, $.settings.columns);
    }

  };
  reset.addEventListener('click', handleSettingsSubmission);

  // Handle clicking on card
  var handleFlipCard = function (event) {

    event.preventDefault();

    var status = $.play(this.index);

    if (status.code != 0) {
      this.classList.toggle('clicked');
    }

    if (status.code == 3) {
      setTimeout(function () {
        var childNodes = document.getElementById('memory--cards').childNodes;
        childNodes[status.args[0]].classList.remove('clicked');
        childNodes[status.args[1]].classList.remove('clicked');
      }.bind(status), nonMatchingCardTime);
    } else if (status.code == 2 || status.code == 4) {
      // Add in a condition for when the cards match to display the message

      var childNodes = document.getElementById('memory--cards').childNodes;

      // Load message
      var message = getMatchMessage(childNodes, status);

      document.getElementById('memory--end-game-message').innerHTML = message;

      // Add the party sparkles to cards that match
      party.sparkles(childNodes[status.args[0]], {
        size: party.variation.range(3, 5),
      });
      party.sparkles(childNodes[status.args[1]], {
        size: party.variation.range(3, 5),
      });

      // If its a win starting sequence
      if (status.code == 4) {

        document.getElementById('memory--end-game-modal').classList.toggle('show');

      } else {
        // If its just a match starting sequence

        document.getElementById('memory--end-game-modal').classList.toggle('show');
      }

      // If it's a win clsoing sequence
      if (status.code == 4) {

        // Display the winning message and score
        document.getElementById('memory-modal__close').addEventListener('click', function () {

          // Setup the score
          var score = parseInt((($.attempts - $.mistakes) / $.attempts) * 100, 10);
          document.getElementById('memory--end-game-score').classList.toggle('show');
          document.getElementById('memory--end-game-score').innerHTML = 'Score: ' + score + ' / 100';

          // Add the end game glass
          document.getElementById('memory--end-game-modal').classList.toggle('end');

          // Confetti explosion for winning
          party.settings.gravity = 400;
          party.confetti(document.querySelector("body"), {
            count: party.variation.range(800, 1000),
            spread: party.variation.range(50, 100),
            size: party.variation.range(3, 5),
            color: [party.Color.fromHex("#0F3D70"), party.Color.fromHex("#000000"), party.Color.fromHex("#ffffff"), party.Color.fromHex("#cccccc")],
            speed: 600,
          });

          // Change the message
          document.getElementById('memory--end-game-message').innerHTML = winMessage(score);
          // set a timer to automatically close the modal after 10 seconds and restart the game
          resetModalTimer = setTimeout(function () {
            document.getElementById('memory--settings-icon').click();
            document.getElementById('memory--end-game-score').classList.toggle('show');
            document.getElementById('memory--end-game-modal').classList.toggle('end');
          }, 10000);


          // Manually reset the game rather than waiting for the timer to expire
          document.getElementById('memory-modal__close').addEventListener('click', function () {
            document.getElementById('memory--settings-icon').click();
            document.getElementById('memory--end-game-score').classList.toggle('show');
            document.getElementById('memory--end-game-modal').classList.toggle('end');

            clearTimeout(resetModalTimer);
          });
        });

      } else {
        // If its just a match closing sequence
        document.getElementById('memory-modal__close').addEventListener('click', function () {
          document.getElementById('memory--end-game-modal').classList.toggle('show');
        });
      }
    }

  };

  var getMatchMessage = function (childNodes, status) {
    // Get one of the matching card elements
    const cardPictureItem = childNodes[status.args[0]].querySelector('.back');
    // Get the card number class from that matching element
    const cardPicture = cardPictureItem.classList[1];

    var message = "";
    switch (cardPicture) {
      case "card-1":
        message = autoLoanMessage();
        break;
      case "card-2":
        message = creditCardMessage();
        break;
      case "card-3":
        message = makingCentsMessage();
        break;
      case "card-4":
        message = mobileMessage();
        break;
    }
    return message;
  }

  var winMessage = function (score) {
    const html = '<div class="memory-modal auto">' +
      '<div class="memory-modal__content">' +
      '<header class="memory-modal__header">' +
      '<h1 class="memory-modal__title">Great Job!</h1>' +
      '</header>' +
      '<div class="memory-modal__body">' +
      '<p class="memory-modal__text">' +
      getEndGameMessage(score) +
      '</p>' +
      '</div>' +
      '<a href="#" id="memory-modal__close" class="memory-modal__close--js">&times;</a>' +
      '</div>' +
      '</div>';

    return html;
  }

  var autoLoanMessage = function () {
    const html = '<div class="memory-modal auto">' +
      '<div class="memory-modal__content">' +
      '<header class="memory-modal__header">' +
      '<h1 class="memory-modal__title">Auto Loans</h1>' +
      '</header>' +
      '<div class="memory-modal__body">' +
      '<p class="memory-modal__text">' +
      'Perfect fit! Navy Federal has competitive auto financing rates for military personnel, veterans and their families. Plus, you can enjoy:</p>' +
      '<ul class="memory-modal__list">' +
      '<li class="memory-modal__list-item">great interest rates and flexible terms</li>' +
      '<li class="memory-modal__list-item">100% financing, including taxes, tags and title</li>' +
      '<li class="memory-modal__list-item">an easy and convenient application process</li>' +
      '</ul>' +
      '<p class="memory-modal__small-text">Insured by NCUA</p>' +
      '</div>' +
      '<a href="#" id="memory-modal__close" class="memory-modal__close--js">&times;</a>' +
      '</div>' +
      '</div>';

    return html;
  }

  var creditCardMessage = function () {
    const html = '<div class="memory-modal credit-card">' +
      '<div class="memory-modal__content">' +
      '<header class="memory-modal__header">' +
      '<h1 class="memory-modal__title">Credit Card</h1>' +
      '</header>' +
      '<div class="memory-modal__body">' +
      '<p class="memory-modal__text">' +
      'Awesome job! Navy Federal offers credit cards with awesome benefits, including:</p>' +
      '<ul class="memory-modal__list">' +
      '<li class="memory-modal__list-item">24/7 help from our U.S.-based member service team</li>' +
      '<li class="memory-modal__list-item">around-the-clock account monitoring</li>' +
      '<li class="memory-modal__list-item">Zero Liability policy protection for unauthorized transactions</li>' +
      '<li class="memory-modal__list-item">reward points or cash back on select cards</li>' +
      '</ul>' +
      '</div>' +
      '<a href="#" id="memory-modal__close" class="memory-modal__close--js">&times;</a>' +
      '</div>' +
      '</div>';

    return html;
  }

  var makingCentsMessage = function () {
    const html = '<div class="memory-modal makingcents">' +
      '<div class="memory-modal__content">' +
      '<header class="memory-modal__header">' +
      '<h1 class="memory-modal__title">MakingCents</h1>' +
      '</header>' +
      '<div class="memory-modal__body">' +
      '<p class="memory-modal__text">' +
      'Way to go! Whether you are just starting out on your financial journey or a seasoned-veteran, MakingCents offers educational information on buying a car or home, saving and paying for college, investing, managing credit cards and more.</p>' +
      '<p class="memory-modal__small-text">Insured by NCUA: <br>Equal Housing Lender (or EHL bug)</p>' +
      '</div>' +
      '<a href="#" id="memory-modal__close" class="memory-modal__close--js">&times;</a>' +
      '</div>' +
      '</div>';

    return html;
  }

  var mobileMessage = function () {
    const html = '<div class="memory-modal mobile">' +
      '<div class="memory-modal__content">' +
      '<header class="memory-modal__header">' +
      '<h1 class="memory-modal__title">Mobile Banking</h1>' +
      '</header>' +
      '<div class="memory-modal__body">' +
      '<p class="memory-modal__text">' +
      'You got it! With mobile banking<sup>1</sup>, you can enjoy:</p>' +
      '<ul class="memory-modal__list">' +
      '<li class="memory-modal__list-item">view account balances and past statements, make payments, transfer funds and order checks</li>' +
      '<li class="memory-modal__list-item">24/7 help from our U.S.-based member service team</li>' +
      '<li class="memory-modal__list-item">digital banking with free Bill Pay<sup>2</sup></li>' +
      '</ul>' +
      '<p class="memory-modal__small-text">Insured by NCUA: <br><sup>1</sup> Message data rates may apply. Visit navyfederal.org for more information. <br><sup>2</sup> The Bill Pay service is provided to you at no cost. The charge for the optional Bill Pay Rush Delivery service is specified in Navy Federal’s Schedule of Fees and Charges, which can be found at navyfederal.org.' +
      '</p>' +
      '</div>' +
      '<a href="#" id="memory-modal__close" class="memory-modal__close--js">&times;</a>' +
      '</div>' +
      '</div>';

    return html;
  }

  /**
   * We are now only returning the single message for any score
   * 
   * @param {receives the score to be able to change the message according to it} score 
   * @returns 
   */
  var getEndGameMessage = function (score) {
    var message = "Please speak to one of our representatives to learn more.";

    // if (score == 100) {
    //   message = "Amazing job!"
    // } else if (score >= 70) {
    //   message = "Great job!"
    // } else if (score >= 50) {
    //   message = "Great job!"
    // } else {
    //   message = "You can do better.";
    // }

    return message;
  }

  // Build grid of cards
  var buildLayout = function (cards, rows, columns) {
    if (!cards.length) {
      return;
    }

    var memoryCards = document.getElementById("memory--cards");
    var index = 0;

    var cardMaxWidth = document.getElementById('memory--app-container').offsetWidth / columns;
    var cardHeightForMaxWidth = cardMaxWidth * (3 / 4);

    var cardMaxHeight = document.getElementById('memory--app-container').offsetHeight / rows;
    var cardWidthForMaxHeight = cardMaxHeight * (4 / 3);

    // Clean up. Remove all child nodes and card clicking event listeners.
    while (memoryCards.firstChild) {
      memoryCards.firstChild.removeEventListener('click', handleFlipCard);
      memoryCards.removeChild(memoryCards.firstChild);
    }

    for (var i = 0; i < rows; i++) {
      for (var j = 0; j < columns; j++) {
        // Use cloneNode(true) otherwise only one node is appended
        memoryCards.appendChild(buildCardNode(index, cards[index],
          (100 / columns) + "%", (100 / rows) + "%"));
        index++;
      }
    }

    // Resize cards to fit in viewport
    if (cardMaxHeight > cardHeightForMaxWidth) {
      // Update height
      memoryCards.style.height = (cardHeightForMaxWidth * rows) + "px";
      memoryCards.style.width = document.getElementById('memory--app-container').offsetWidth + "px";
      memoryCards.style.top = ((cardMaxHeight * rows - (cardHeightForMaxWidth * rows)) / 2) + "px";
    } else {
      // Update Width
      memoryCards.style.width = (cardWidthForMaxHeight * columns) + "px";
      memoryCards.style.height = document.getElementById('memory--app-container').offsetHeight + "px";
      memoryCards.style.top = 0;
    }

  };

  // Update on resize
  window.addEventListener('resize', function () {
    buildLayout($.cards, $.settings.rows, $.settings.columns);
  }, true);

  // Build single card
  var buildCardNode = function (index, card, width, height) {
    var flipContainer = document.createElement("li");
    var flipper = document.createElement("div");
    var front = document.createElement("a");
    var back = document.createElement("a");

    flipContainer.index = index;
    flipContainer.style.width = width;
    flipContainer.style.height = height;
    flipContainer.classList.add("flip-container");
    if (card.isRevealed) {
      flipContainer.classList.add("clicked");
    }

    flipper.classList.add("flipper");
    front.classList.add("front");
    front.setAttribute("href", "#");
    back.classList.add("back");
    back.classList.add("card-" + card.value);
    if (card.isMatchingCard) {
      back.classList.add("matching");
    }
    back.setAttribute("href", "#");

    flipper.appendChild(front);
    flipper.appendChild(back);
    flipContainer.appendChild(flipper);

    flipContainer.addEventListener('click', handleFlipCard);

    return flipContainer;
  };

})(MemoryGame);