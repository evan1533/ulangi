/*
 * Copyright (c) Minh Loi.
 *
 * This file is part of Ulangi which is released under GPL v3.0.
 * See LICENSE or go to https://www.gnu.org/licenses/gpl-3.0.txt
 */

import {
  ObservableCategoryDetailScreen,
  ObservableThemeStore,
} from '@ulangi/ulangi-observable';
import { observer } from 'mobx-react';
import * as React from 'react';
import { View } from 'react-native';

import { CategoryDetailScreenIds } from '../../constants/ids/CategoryDetailScreenIds';
import { CategoryDetailScreenDelegate } from '../../delegates/category/CategoryDetailScreenDelegate';
import { Screen } from '../common/Screen';
import { NoVocabulary } from '../vocabulary/NoVocabulary';
import { VocabularyBulkActionBar } from '../vocabulary/VocabularyBulkActionBar';
import { VocabularyList } from '../vocabulary/VocabularyList';
import { CategoryActionFloatingButton } from './CategoryActionFloatingButton';
import { CategoryDetailHeader } from './CategoryDetailHeader';
import {
  CategoryDetailScreenStyles,
  categoryDetailScreenResponsiveStyles,
} from './CategoryDetailScreen.style';

export interface CategoryDetailScreenProps {
  themeStore: ObservableThemeStore;
  observableScreen: ObservableCategoryDetailScreen;
  screenDelegate: CategoryDetailScreenDelegate;
}

@observer
export class CategoryDetailScreen extends React.Component<
  CategoryDetailScreenProps
> {
  public get styles(): CategoryDetailScreenStyles {
    return categoryDetailScreenResponsiveStyles.compile(
      this.props.observableScreen.screenLayout,
      this.props.themeStore.theme,
    );
  }

  public render(): React.ReactElement<any> {
    return (
      <Screen
        style={this.styles.screen}
        testID={CategoryDetailScreenIds.SCREEN}
        useSafeAreaView={true}
        observableScreen={this.props.observableScreen}>
        <CategoryDetailHeader
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          category={this.props.observableScreen.category}
          selectedVocabularyStatus={
            this.props.observableScreen.selectedVocabularyStatus
          }
          selectedSortType={this.props.observableScreen.selectedSortType}
          showVocabularyFilterMenu={
            this.props.screenDelegate.showVocabularyFilterMenu
          }
          showVocabularySortMenu={
            this.props.screenDelegate.showVocabularySortMenu
          }
        />
        {this.renderVocabularyList()}
        {this.renderBulkActionBar()}
        {this.renderCategoryFloatingButton()}
      </Screen>
    );
  }

  private renderVocabularyList(): React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.vocabularyList !== null &&
      this.props.observableScreen.vocabularyListState.noMore === true &&
      this.props.observableScreen.vocabularyListState.vocabularyList.size === 0
    ) {
      return (
        <NoVocabulary
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          refresh={this.props.screenDelegate.refresh}
        />
      );
    } else {
      return (
        <VocabularyList
          key={this.props.observableScreen.selectedVocabularyStatus.get()}
          testID={CategoryDetailScreenIds.VOCABULARY_LIST}
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          vocabularyListState={this.props.observableScreen.vocabularyListState}
          toggleSelection={this.props.screenDelegate.toggleSelection}
          showVocabularyDetail={this.props.screenDelegate.showVocabularyDetail}
          showVocabularyActionMenu={
            this.props.screenDelegate.showVocabularyActionMenu
          }
          fetchNext={this.props.screenDelegate.fetch}
          refresh={this.props.screenDelegate.refresh}
        />
      );
    }
  }

  private renderBulkActionBar(): null | React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.isSelectionModeOn.get()
    ) {
      return (
        <VocabularyBulkActionBar
          theme={this.props.themeStore.theme}
          screenLayout={this.props.observableScreen.screenLayout}
          vocabularyListState={this.props.observableScreen.vocabularyListState}
          showVocabularyBulkActionMenu={
            this.props.screenDelegate.showVocabularyBulkActionMenu
          }
          clearSelections={this.props.screenDelegate.clearSelections}
        />
      );
    } else {
      return null;
    }
  }

  private renderCategoryFloatingButton(): null | React.ReactElement<any> {
    if (
      this.props.observableScreen.vocabularyListState.isSelectionModeOn.get() ===
      false
    ) {
      return (
        <View style={this.styles.floating_button_container}>
          <CategoryActionFloatingButton
            theme={this.props.themeStore.theme}
            screenLayout={this.props.observableScreen.screenLayout}
            showCategoryActionMenu={
              this.props.screenDelegate.showCategoryActionMenu
            }
          />
        </View>
      );
    } else {
      return null;
    }
  }
}
