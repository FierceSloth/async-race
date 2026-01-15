import { Component } from '@/common/component';
import type { IComponentChild } from '@/common/types/types';

import styles from './card.module.scss';

type IProps = {} & IComponentChild;

export class Card extends Component {
  constructor({ className = [], children = [] }: IProps) {
    super({ className: [styles.card, ...className] }, ...children);
  }
}
