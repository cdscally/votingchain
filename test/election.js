var Voting = artifacts.require('./Voting.sol')

contract('Voting', function(accounts) {

  it('begins NewElection with candidates', function() {

    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;


    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return currentElection.getCandidatesCount();
    }).then(function(numberOfCandidates) {
      assert.equal(numberOfCandidates, 2 , 'Wrong number of candidates')
    });
  });

  it('starts Voting with zero votes for candidates', function() {
    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return currentElection.getCandidateVotes(0);
    }).then(function(totalVotesForCandidate) {
      assert.equal(totalVotesForCandidate, 0, 'No votes should have been logged for candidate')
    }).then(function() {
      return currentElection.getCandidateVotes(1);
    }).then(function(totalVotesForCandidate) {
      assert.equal(totalVotesForCandidate, 0, 'No votes should have been logged for candidate')
    });
  });

  it('allows voter to cast a Yes vote', function() {
    var currentElection;
    var loggedEvent;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      return currentElection.vote(0);
    }).then(function(currentElectionLog) {
      loggedEvent = currentElectionLog.logs[0].event;
      assert.equal(loggedEvent, 'Voted', 'Voter could not cast a vote')
    });
  });

  it('allows voter to cast a No vote', function() {
    var currentElection;
    var loggedEvent;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;


    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      return currentElection.vote(1);
    }).then(function(currentElectionLog) {
      loggedEvent = currentElectionLog.logs[0].event;
      assert.equal(loggedEvent, 'Voted', 'Voter could not cast a vote')
    });
  });

  it('shows accurate number of cast votes for a candidate', function() {
    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      return currentElection.vote(1);
    }).then(function() {
      return currentElection.getCandidateVotes(1);
    }).then(function(totalVotesForCandidate) {
      assert.equal(totalVotesForCandidate.toNumber(), 1, 'Cannot find cast votes for candidate')
    });
  });

  it('returns winning candidate ID', function() {
    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      return currentElection.vote(0);
    }).then(function() {
      return currentElection.tallyElectionResults();
    }).then(function(winningCandidateID) {
      assert.equal(winningCandidateID, 0, 'No winning candidate was returned')
    });
  });

  it('declares Voting winner', function() {
    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      return currentElection.vote(0);
    }).then(function() {
      return currentElection.declareWinner();
    }).then(function(VotingWinner) {
      assert.equal(VotingWinner, 'Yes', 'Not returning right Voting winner');
    });
  });

  it("allows a voter to become registered", function() {
    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;
    var loggedEvent;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      loggedEvent = result.logs[0].event;
      assert.equal(loggedEvent, "Registered", 'Voter has not been registered')
    });
  });

  it("allows voter to retrieve own vote", function() {
    var currentElection;
    var title = "Fake EU Referendum";
    var electionPeriod = 2;

    return Voting.new(title, electionPeriod, ['Yes', 'No']).then(function(instance) {
      currentElection = instance;
      return instance.registerVoter(accounts[0]);
    }).then(function(result) {
      return currentElection.vote(0);
    }).then(function(result) {
      return currentElection.displayOwnVote();
    }).then(function(candidateName) {
      assert.equal(candidateName, 'Yes', 'Wrong vote cast')
    });
  });

});
