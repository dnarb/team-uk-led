# TEAM-UK

A data visualisation dashboard for the TEAM project - UK instance. Based on TEAM-Kenya interface developed by Maciej Ziarkowski

## Configuring the site

In order to update the configuration of the site or the data displayed, follow this process:

1. Create a new branch based on `main`
2. Make changes and commit them to the new branch. When changing config/data, follow the specification described in the sections below.
3. Create a GitHub Pull Request to merge the new branch into `main`. Review the changes to make sure the new config / data follow the specification.
4. Merge the PR into `main` - this will trigger the preparation of the updated data and releasing of the update site

## Data input specification

The data displayed in the tool is configured by modifying files in the `data-processing/data-input` folder.

The following contents are required:

`data-processing/data-input`:

- `/manual` - files that are not extracted from the TEAM database but are manually prepared
  - `config.json` - a JSON file containing a simple object with the following fields:
    - `minYear` - the first year for which data will be displayed
    - `maxYear` - the last year for which data will be displayed
    - `snapshotYears` - an array of snapshot years shown on scenario comparison charts
  - `Scenarios.csv` - metadata for scenarios. A CSV file with following columns:
    - `ScenarioID` - a numeric ID of the scenario
    - `ScenarioAB` - an alphanumeric short code for the scenario. Used in URLs. The values need to match folder names in `extract/scenarios` folder.
    - `ScenarioNA` - a human-readable name for the scenario - shown as labels for charts / as options in dropdowns
    - `Description` - a longer description for the scenario - shown in the scenario selection sidebar
  - `Emission.csv` - metadata for emissions. A CSV with following columns:
    - `EmissionID` - numeric ID for emissions
    - `GreenhouseGasFlag` - 0/1 flag - should this emission be included in the Greenhouse Gases tab?
    - `AirPollutantFlag` - 0/1 flag - should this emission be included in the Air Pollutants tab? Based on this flag, an additional dimension - `APEmission` - is created from the `Emission` dimension
    - `GWP` - Global Warming Potential factor - used for multiplying the emission values of different substances to get the CO2 equivalent values
  - `HybridID.csv` - lookup CSV for Hybrid attribute of vehicle technology (`HybridID`, `HybridNA`) -> `Tech.Hybrid`
  - `SecondHandImportID.csv` - lookup CSV for SecondHandImport attribute of vehicle technology (`SecondHandImportID`, `SecondHandImportNA`) -> `Tech.SecondHandImport`
- `/extract` - files extracted directly from the TEAM database
  - `/dimensions` - lookup tables for vehicle technologies and other variables used in the system
    - `EmissionID.csv` (`EmissionID`, `EmissionAB`, `EmissionNA`) -> `Emission`
    - `EmissionType.csv` (`ETypeID`, `ETypeNA`) -> `EType`
    - `EngineID.csv` (`EngineID`, `EngineAB`, `EngineNA`) -> `Tech.Engine`
    - `FuelID.csv` (`FuelID`, `FuelAB`, `FuelNA`) -> `Tech.Fuel`
    - `JSTypeID.csv` (`JSTypeID`, `JSTypeNA`) -> `JSType`
    - `MassCatID.csv` (`MassCatID`, `MassCatNA`) -> `Tech.MassCat`
    - `MS_modes.csv` (`modeID`, `modeName`) -> `MSMode`
    - `Technology.csv` - represents technologies where a single technology is a combination of `EngineID`, `FuelID`, `HybridID`, `MassCatID`, `SecondHandImportID`, `TransTypeID`, and `VehTypeID`
    - `TransTypeID.csv` (`TransTypeID`, `TransTypeAB`, `TransTypeNA`) -> `Tech.TransType`
    - `Trip_lengths.csv` (`triplenID`, `triplenName`) -> `TripLen`
    - `VehCatID.csv` (`VehCatID`, `VehCatNA`) -> `VehCat`
    - `VehTypeID.csv` (`VehTypeID`, `VehTypeAB`, `VehTypeNA`) -> `Tech.VehType`
  - `/scenarios` - the subdirectory names should match the `ScenarioAB` values from `/manual/Scenarios.csv`
    - `/[ScenarioAB]` - data for a single scenario. Note that even if the data tables contain a `ScenarioID` column, this column will be ignored because of how the data is currently stored in the TEAM database (data for separate scenarios is stored in separate database instances so each table will have `ScenarioID` value of 0). The column will be replaced by the appropriate ID taken from the `manual/Scenarios.csv` table based on the scenario folder name.
      - `ED.xlsx`
      - `ET.xlsx`
      - `Interface_VSM_NumVeh.xlsx`
      - `Interface_VSM_VehKM.xlsx`
      - `Mode_Shares_TripLength.xlsx`

## Site config specification

The configuration of the dashboard website is stored in the `public` folder:

- `/public`:
  - `/config`
    - `config.json` - same as `config.json` in the data inputs `manual` directory, but currently needs to be updated separately to keep both files in sync.
    - `data-tabs.json` - see [Data tabs config](#data-tabs-config)
    - `data-sources.json` - see [Data sources config](#data-sources-config)
    - `dimensions-meta.json` - see [Dimensions config](#dimensions-config)
    - `logos.json` - an array of logos. Each object has the following fields:
      - `img` - URL of image file (relative to the `public` directory)
      - `tooltip` - text that displays in the hover tooltip
      - `link` - URL that will be opened (in a new tab) upon clicking the logo
      - `height` - height of the logo in pixels. Width is automatic to maintain aspect ratio.
  - `/data` - placeholder directory for preprocessed data files. The output from the data pipeline is placed here automatically before the website is released.
  - `/images` - images used in the site. Mostly logos.
  - `/text` - markdown files for the text content of the website
    - `AboutPage.md` - markdown formatted text of the About page
    - `AboutSidebar.md` - markdown formatted text of the About section of the sidebar
  - `favicon.ico` - an icon displayed in browser tabs/bookmarks.

### Data tabs config

The `data-tabs.json` is a JSON file configuring the views/tabs in the website.
The file contains an array of objects with the following properties:

- `slug` - URL-friendly text ID of the tab
- `label` - title of the tab
- `content` - object describing the data/chart content of the tab:
  - `variable` - configuration for the data variable shown in the charts:
    - `name` - name of the variable, matching one in `data-sources.json`
    - `parameters` - array of dimensions that serve as parameters for the variable
  - `primarySelect` - a single dimension path for the primary select UI. Can be `null` if there should be no primary select
  - `secondarySelect` - an array of dimension paths for the secondary select UI components. Can be an empty array if no secondary select should be shown.
  - `operations` (optional) - a dictionary of hard-coded data operations for this tab. Keys are dimension paths. Values are objects with the following properties:
    - `aggregate` - true/false, should the data be aggregated or disaggregated by the dimension?
    - `filter` - array of values to filter the dimension. Set to `null` if there should be no filtering.
  - `defaultChart` - object for configuring the default chart for the view.
    - `type` - name of the default chart
    - `options` - object of options specific to the chart type
      Note that right now there's only one chart type: `time-series`, and the available options is `totalLine` (true/false, optional)

### Data sources config

The `data-sources.json` is a JSON file configuring the data variables viewable on the website.

The file contains a dictionary of objects. Keys are variable names. Values are objects with the following properties:

- `pathSchema` - defines what CSV file should be fetched based on the variable and the parameter values. This needs to match the names of files output by the data pipeline.
- `title` - the title of the variable / chart. Contains a special syntax where a dimension name wrapped in curly braces (e.g. `{VehCat}`) will result in a dropdown for the specified parameter (in this case, `VehCat`) being inserted into the chart title.
- `yAxisTitle` - label displayed by the chart's Y axis
- `numberFractionalDigits` - how many fractional digits should be shown when formatting the hovered value
- `yAxisFractionalDigits` (optional) - same as `numberFractionalDigits` but for formatting Y axis tick labels. If not present, `numberFractionalDigits` is used.
- `numberDivisor` (optional) - number to divide values by. Useful if figures are very high and we want to display them like `X millions`. Needs to be used together with `numberDivisorText`.
- `numberDivisorText` (optional) - a text description for `numberDivisor`. For example if that option is set to `1000000`, this option could be set to `mln`

### Dimensions config

The `dimensions-meta.json` is a JSON file configuring the dimensions / categorical variables present in the dashboard.

The file contains a dictionary of objects. Keys are dimension names. Values are objects with the following properties:

- `Name` - human-readable name for the variable to be displayed in the dashboard
- `IsLeaf` - true/false, is this a leaf dimension or is it used to link many dimensions together. Currently the only dimension with `IsLeaf` set to `false` is `Tech`
- `Colors` (optional) - a mapping of dimension values to colors. The keys are expected to be the values of the `AB` field, and if the dimensions doesn't have the `AB` field then `ID`. The values are colors in a hexadecimal (HEX) format. This dictionary needs to be present for a dimension in order for the tool to allow coloring charts by the that dimension.
