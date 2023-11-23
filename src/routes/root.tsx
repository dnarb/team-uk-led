import { Box, Divider, Link, Stack, Toolbar, Typography } from '@mui/material';
import { array, number, object, string } from '@recoiljs/refine';
import { useQuery } from '@tanstack/react-query';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { LoaderFunctionArgs, Outlet } from 'react-router';
import { Link as RouterLink } from 'react-router-dom';

import { Logo } from '../components/Logo';
import { queryJson, queryText } from '../data/fetch/load-file';
import { configChecker } from '../data/fetch/models/config';
import { allDimensionsMetaChecker } from '../data/fetch/models/dimensions-meta';
import { configState } from '../root-state';
import { allDimensionsMetaState } from '../sections/data-tab/dimensions/dimensions-state';
import { ScenarioPanel } from '../sections/scenario/ScenarioPanel';
import { AppLink } from '../utils/nav';
import { StateSetter } from '../utils/recoil/StateSetter';
import { MutableCheckerReturn } from '../utils/recoil/refine';

const logosConfigChecker = array(
  object({
    img: string(),
    tooltip: string(),
    link: string(),
    height: number(),
  })
);

type LogosConfig = MutableCheckerReturn<typeof logosConfigChecker>;

const rootLoaderChecker = object({
  logos: logosConfigChecker,
  config: configChecker,
  allDimensionsMeta: allDimensionsMetaChecker,
  aboutMarkdown: string(),
});

type RootLoaderData = MutableCheckerReturn<typeof rootLoaderChecker>;

export const rootLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<RootLoaderData> => {
  return {
    logos: await queryJson('/config/logos.json', request.signal),
    config: await queryJson('/config/config.json', request.signal),
    allDimensionsMeta: await queryJson(
      '/config/dimensions-meta.json',
      request.signal
    ),
    aboutMarkdown: await queryText('/text/AboutSidebar.md', request.signal),
  };
};

export const RootRoute = () => {
  const { data: logos } = useQuery(['/config/logos.json']);
  const { data: config } = useQuery(['/config/config.json']);
  const { data: allDimensionsMeta } = useQuery([
    '/config/dimensions-meta.json',
  ]);
  const { data: aboutMarkdown } = useQuery<string>(['/text/AboutSidebar.md']);

  return (
    <>
      <StateSetter value={config as any} state={configState} />
      <StateSetter
        value={allDimensionsMeta as any}
        state={allDimensionsMetaState}
      />
      <Box display="flex" flexDirection="row" justifyContent="stretch">
        <Box
          minHeight="100vh"
          height="100%"
          width="400px"
          flexShrink={0}
          bgcolor="whitesmoke"
        >
          <Stack direction="column" height="100%" divider={<Divider />}>
            <Toolbar sx={{ mb: '-1px' }}>
              <Typography variant="h3" fontWeight={600}>
                <Link
                  sx={{ textDecoration: 'none' }}
                  component={RouterLink}
                  to="/"
                >
                  TEAM UK
                </Link>
              </Typography>
            </Toolbar>
            <Box height={250}>
              <SidebarSection>
                <ScenarioPanel />
              </SidebarSection>
            </Box>
            <Box flexGrow={1}>
              <SidebarSection>
                <Typography variant="h5">About</Typography>
                <ReactMarkdown
                  children={aboutMarkdown!}
                  components={{
                    a: ({ href, title, children }) =>
                      href ? (
                        <AppLink
                          textAlign="right"
                          width="100%"
                          display="block"
                          href={href}
                          children={children}
                        />
                      ) : null,
                  }}
                />
              </SidebarSection>
            </Box>
            <Box height={200} p={1}>
              <Logos config={logos as any} />
            </Box>
          </Stack>
        </Box>
        <Box sx={{ minWidth: '1400px', height: '100vh' }}>
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

function SidebarSection({ children }: any) {
  return <Box p={2}>{children}</Box>;
}

function Logos({ config }: { config: LogosConfig }) {
  return (
    <Box display="flex" flexWrap="wrap" alignItems={'center'}>
      {config.map((x) => (
        <Logo key={x.img} {...x} />
      ))}
    </Box>
  );
}
