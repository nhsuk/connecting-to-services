@ui
@find-a-pharmacy
@CI2-973
#noinspection CucumberUndefinedStep

Feature: Find a Pharmacy
  """
  This feature file tests the find a pharmacy search to ensure all of the functionality on this page is working.
  """

  Scenario: Search for a valid location within England
    Given I am on the find a pharmacy page
    When I search for 'Manchester'
    And I choose 'Manchester, North West, M2' from the list of places that match
    Then 10 results are displayed
    And all results contain the required components
