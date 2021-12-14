import { HTMLAttributes, ReactNode } from 'react';
import './styles.css';

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  appendClassnames?: string[] | string;
}

export const Box = ({ children, appendClassnames, ...rest }: Props) => {
  const getClassnames = () =>
    appendClassnames instanceof Array
      ? appendClassnames.join(' ')
      : appendClassnames;

  return (
    <div className={`box ${getClassnames()}`} {...rest}>
      {children}
    </div>
  );
};
