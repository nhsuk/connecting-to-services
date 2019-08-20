@ui
@find-a-pharmacy
@CI2-973
#noinspection CucumberUndefinedStep

Feature: Find a Pharmacy
  """
  This feature file tests the find a pharmacy search to ensure all of the functionality on this page is working.
  """

  Background:
    Given I am on the find a pharmacy page

  Scenario: The find a pharmacy page search is displayed correctly
    Then all of the components on the find a pharmacy search page are valid

  Scenario: The find a pharmacy results page is displayed correctly
    Then 10 pharmacy results are displayed
    And all of the components on the find a pharmacy results page are valid

  Scenario: Search for a valid location within England
    When I search for 'Manchester'
    And I choose 'Manchester, North West, M2' from the list of places that match
    Then a valid list of results is returned

  Scenario: Search for a valid postcode within England
    When I search for 'YO21 1BL'
    Then a valid list of results is returned

  Scenario: Enter an invalid search term
    When I search for 'iophaeo'
    Then the No results page is displayed
    And the Back to find a pharmacy link is available

  Scenario: Attempt to search with no input
    When I search for ''
    Then the search validation message is displayed

  Scenario: Attempt to search with only whitespace
    When I search for '    '
    Then the search validation message is displayed

  Scenario: Search for an invalid postcode
    When I search for 'LSS10 7EF'
    Then the search validation message is displayed

  Scenario Outline: Search for a valid location in the UK outside of England
    When I search for '<search_term>'
    Then the No results page for a location in the UK is displayed
    And the the link to the NHS website in '<country>' is available
    Examples:
      | search_term  | country  |
      | Glasgow      | Scotland |
      | Llangollen   | Wales    |

  Scenario: Search for a valid location outside of the UK
    When I search for 'Killarney'
    Then the No results page for a location outside the UK is displayed

  Scenario Outline: Search for a valid postcode in the UK outside of England
    When I search for '<search_term>'
    Then the No results page for a location in the UK is displayed
    And the the link to the NHS website in <country> is available
    Examples:
      | search_term  | country          |
      | G1 1DW       | Scotland         |
      | CF32         | Wales            |
      | BT60         | Northern Ireland |

  Scenario: Check services available links are valid
    When I search for 'WF5'
    Then all of the Services available links are valid

  Scenario: Check maps and directions link redirects to Google Maps
    When I search for 'LS1'
    Then all of the Maps and directions links are valid

  Scenario: Opening times drop down is populated
    When I search for 'London'
    And I choose 'London, Greater London, WC2N' from the list of places that match
    Then all of the Opening times drop downs are valid
