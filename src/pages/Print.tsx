import { useRef } from 'react';
import styled from '@emotion/styled';
import { useLocation, useNavigate } from 'react-router-dom';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { useReactToPrint } from 'react-to-print';
import { Button, Detail, Flex, HighlightText, Overview } from '../components';
import { useAppSelector } from '../store/store';
import { getIsAdmin } from '../store/userSlice';
import { routes, controls } from '../constants';
import { toast } from 'react-toastify';

const PrintPage = () => {
	const {
		state: { year, month },
	} = useLocation() as { state: { year: number; month: number } };

	const navigate = useNavigate();
	const isAdmin = useAppSelector(getIsAdmin);

	const printRef = useRef<HTMLDivElement>(null);
	const query = { inOrder: controls[0], year, month, workerName: '' };

	const handlePrint = useReactToPrint({
		contentRef: printRef,
		documentTitle: 'print',
		onBeforePrint: async () => {
			await new Promise(resolve => setTimeout(resolve, 50));
		},
	});

	return (
		<Container>
			<Flex justifyContent={'space-between'} margin={'0 0 32px'} width={'100%'}>
				<GoBackButton type="button" onClick={() => navigate(routes.DETAILS, { state: { year, month: month - 1 } })}>
					<BsArrowLeftCircle size="24" color="var(--text-color)" />
					뒤로가기
				</GoBackButton>
				<Flex gap="16px">
					<HighlightText color={'var(--bg-color)'} bgColor={'var(--text-color)'}>{`${year}월 ${month}월`}</HighlightText>

					<PrintButton
						type="button"
						onClick={() => {
							if (!printRef.current) {
								toast.error('문제가 발생했습니다. 다시 시도해 주세요.');
								console.error('ref 문제 발생');
								return;
							}

							handlePrint();
						}}
						disabled={!isAdmin}>
						{isAdmin ? '출력하기' : 'Admin Only'}
					</PrintButton>
				</Flex>
			</Flex>
			<div ref={printRef} style={{ borderColor: 'var(--color-dark)' }}>
				<Overview query={query} />
				<Detail query={query} />
			</div>
		</Container>
	);
};

const Container = styled.section`
	margin: 16px auto;
	padding: calc(var(--padding-md) * 3) 0;

	@media screen and (min-width: 640px) {
		width: 640px;
	}

	@media screen and (min-width: 768px) {
		width: 768px;
	}
`;

const GoBackButton = styled(Button)`
	display: inline-flex;
	justify-content: center;
	align-items: center;
	gap: 8px;
	padding: calc(var(--padding-md) * 0.8) calc(var(--padding-md) * 1.2);
	font-weight: 700;
	font-size: 15px;
	color: var(--text-color);
	background-color: var(--color-gray-opacity-100);
	outline: 1px solid var(--color-white);
	border-radius: var(--radius-extra);
	transition: outline 0.3s ease-in-out 0.15s;

	&:hover {
		outline: 1px solid #c4c4c4;
		outline-offset: 2px;
	}
`;

const PrintButton = styled(Button)<{ disabled: boolean }>`
	padding: calc(var(--padding-md) * 0.8) calc(var(--padding-md) * 1.2);
	font-weight: var(--fw-bold);
	color: #fff;
	background-color: ${({ disabled }) => (disabled ? 'var(--color-gray-500)' : 'var(--color-green-50)')};
	border-radius: ${({ disabled }) => (disabled ? 'var(--radius)' : 'var(--radius-extra)')};
	transition: background-color 0.3s ease-in-out 0.15s;

	&:hover {
		background-color: ${({ disabled }) => (disabled ? 'var(--color-gray-500)' : 'var(--color-green-200)')};
	}
`;

export default PrintPage;
