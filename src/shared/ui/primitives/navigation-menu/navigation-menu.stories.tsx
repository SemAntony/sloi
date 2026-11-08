import type { Meta, StoryObj } from '@storybook/react';
import { forwardRef, type ComponentPropsWithoutRef, type ComponentRef, useState } from 'react';
import { cn } from '../../../lib/cn/cn';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuSub,
  NavigationMenuTrigger,
  NavigationMenuViewport
} from './navigation-menu';
import styles from './navigation-menu.stories.module.scss';

const meta = {
  title: 'UI/Primitives/NavigationMenu',
  component: NavigationMenu
} satisfies Meta<typeof NavigationMenu>;

export default meta;

type Story = StoryObj<typeof meta>;

type StoryListItemProps = ComponentPropsWithoutRef<'a'> & {
  title: string;
};

const StoryListItem = forwardRef<ComponentRef<'a'>, StoryListItemProps>(
  ({ className, children, title, ...props }, ref) => (
    <li>
      <NavigationMenuLink asChild>
        <a ref={ref} className={cn(styles.listItemLink, className)} {...props}>
          <div className={styles.listItemHeading}>{title}</div>
          <p className={styles.listItemText}>{children}</p>
        </a>
      </NavigationMenuLink>
    </li>
  )
);

StoryListItem.displayName = 'StoryListItem';

const DefaultPreview = () => (
  <NavigationMenu className={styles.navigationMenu}>
    <NavigationMenuList>
      <NavigationMenuItem value="learn">
        <NavigationMenuTrigger>Learn</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={cn(styles.contentList, styles.contentListPrimary)}>
            <li className={styles.calloutItem}>
              <NavigationMenuLink asChild>
                <a className={styles.calloutLink} href="#primitives">
                  <span className={styles.calloutBadge}>UI</span>
                  <div className={styles.calloutHeading}>Radix Primitives</div>
                  <p className={styles.calloutText}>
                    Unstyled, accessible components for React applications.
                  </p>
                </a>
              </NavigationMenuLink>
            </li>

            <StoryListItem href="#stitches" title="Stitches">
              CSS-in-JS with a strong developer experience.
            </StoryListItem>
            <StoryListItem href="#colors" title="Colors">
              Curated palettes that work across themes.
            </StoryListItem>
            <StoryListItem href="#icons" title="Icons">
              Crisp iconography tuned for 15x15 and 24x24 sizes.
            </StoryListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem value="overview">
        <NavigationMenuTrigger>Overview</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={styles.contentList}>
            <StoryListItem href="#introduction" title="Introduction">
              Build quality interfaces with consistent interaction patterns.
            </StoryListItem>
            <StoryListItem href="#styling" title="Styling">
              Works with CSS modules, utility classes, and CSS-in-JS.
            </StoryListItem>
            <StoryListItem href="#animation" title="Animation">
              Use keyframes or your preferred animation library.
            </StoryListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink href="#github" className={styles.directLink}>
          GitHub
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuIndicator />
    </NavigationMenuList>

    <div className={styles.viewportPosition}>
      <NavigationMenuViewport />
    </div>
  </NavigationMenu>
);

export const Default: Story = {
  render: () => <DefaultPreview />
};

const ControlledPreview = () => {
  const [value, setValue] = useState('');

  return (
    <div className={styles.stack}>
      <NavigationMenu className={styles.navigationMenu} value={value} onValueChange={setValue}>
        <NavigationMenuList>
          <NavigationMenuItem value="docs">
            <NavigationMenuTrigger>Docs</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={styles.contentList}>
                <StoryListItem href="#getting-started" title="Getting started">
                  Install primitives and compose your first menu.
                </StoryListItem>
                <StoryListItem href="#patterns" title="Patterns">
                  Practical examples for common product navigation.
                </StoryListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem value="resources">
            <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className={styles.contentList}>
                <StoryListItem href="#changelog" title="Changelog">
                  Track updates and migration notes between releases.
                </StoryListItem>
                <StoryListItem href="#community" title="Community">
                  Join conversations around design systems and accessibility.
                </StoryListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>

        <div className={styles.viewportPosition}>
          <NavigationMenuViewport />
        </div>
      </NavigationMenu>

      <p className={styles.status}>Open item: {value || 'none'}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: () => <ControlledPreview />
};

const VerticalPreview = () => (
  <NavigationMenu orientation="vertical" className={cn(styles.navigationMenu, styles.verticalRoot)}>
    <NavigationMenuList>
      <NavigationMenuItem value="product">
        <NavigationMenuTrigger>Product</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={styles.contentList}>
            <StoryListItem href="#components" title="Components">
              Browse ready-to-style building blocks.
            </StoryListItem>
            <StoryListItem href="#tokens" title="Design tokens">
              Keep spacing, type, and color consistent.
            </StoryListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem value="company">
        <NavigationMenuTrigger>Company</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className={styles.contentList}>
            <StoryListItem href="#about" title="About">
              Learn about the team and roadmap.
            </StoryListItem>
            <StoryListItem href="#careers" title="Careers">
              Open roles for design systems and frontend engineers.
            </StoryListItem>
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuIndicator />
    </NavigationMenuList>

    <NavigationMenuViewport className={styles.verticalViewport} />
  </NavigationMenu>
);

export const Vertical: Story = {
  render: () => <VerticalPreview />
};

const SubmenuPreview = () => (
  <NavigationMenu className={styles.navigationMenu}>
    <NavigationMenuList>
      <NavigationMenuItem value="guides">
        <NavigationMenuTrigger>Guides</NavigationMenuTrigger>
        <NavigationMenuContent>
          <NavigationMenuSub defaultValue="foundations" className={styles.subMenu}>
            <NavigationMenuList className={styles.subMenuList}>
              <NavigationMenuItem value="foundations">
                <NavigationMenuTrigger showChevron={false}>Foundations</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className={styles.subPanel}>
                    <NavigationMenuLink href="#spacing" className={styles.subLink}>
                      Spacing scale
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#typography" className={styles.subLink}>
                      Typography system
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem value="components">
                <NavigationMenuTrigger showChevron={false}>Components</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className={styles.subPanel}>
                    <NavigationMenuLink href="#inputs" className={styles.subLink}>
                      Input and form patterns
                    </NavigationMenuLink>
                    <NavigationMenuLink href="#navigation" className={styles.subLink}>
                      Navigation and overlays
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>

            <NavigationMenuViewport className={styles.subViewport} />
          </NavigationMenuSub>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>

    <div className={styles.viewportPosition}>
      <NavigationMenuViewport />
    </div>
  </NavigationMenu>
);

export const WithSubmenu: Story = {
  render: () => <SubmenuPreview />
};
