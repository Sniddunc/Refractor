import { all, call, put, takeLatest } from 'redux-saga/effects';
import {
	GET_PLAYER_SUMMARY,
	GET_RECENT_PLAYERS,
	SEARCH_PLAYERS,
	setCurrentPlayer,
	setRecentPlayers,
	setSearchResults,
} from './playerActions';
import {
	getPlayerSummary,
	getRecentPlayers,
	searchPlayers,
} from '../../api/playerApi';
import { setErrors } from '../error/errorActions';
import { SET_SUCCESS, setSuccess } from '../success/successActions';

function* getPlayerSummaryAsync(action) {
	try {
		const { data } = yield call(getPlayerSummary, action.playerId);

		// Flatten data
		const summary = {
			...data.payload,
			warnings: {},
			mutes: {},
			kicks: {},
			bans: {},
		};

		if (data.payload.warnings) {
			data.payload.warnings.forEach((w) => (summary.warnings[w.id] = w));
		}

		if (data.payload.mutes) {
			data.payload.mutes.forEach((m) => (summary.mutes[m.id] = m));
		}

		if (data.payload.kicks) {
			data.payload.kicks.forEach((k) => (summary.kicks[k.id] = k));
		}

		if (data.payload.bans) {
			data.payload.bans.forEach((b) => (summary.bans[b.id] = b));
		}

		yield put(setCurrentPlayer(summary));
	} catch (err) {
		console.log('Could not get player summary', err);
		yield setErrors('playersummary', 'Could not get player summary');
	}
}

function* searchPlayersAsync(action) {
	try {
		const { data } = yield call(searchPlayers, action.payload);

		yield put(setSearchResults(data.payload));

		yield put(setSuccess('searchplayers', 'Showing results'));
		yield put(setErrors('searchplayers', undefined));
	} catch (err) {
		console.log('Could not search players', err);
		const { data } = err.response;

		yield put(setSuccess('searchplayers', undefined));
		yield put(
			setErrors(
				'searchplayers',
				!data.errors
					? `Could not create server: ${err.response.data.message}`
					: data.errors
			)
		);
	}
}

function* getRecentPlayersAsync(action) {
	try {
		const { data } = yield call(getRecentPlayers);

		yield put(setRecentPlayers(data.payload));

		yield put(setSuccess('recentplayers', 'Recent players fetched'));
		yield put(setErrors('recentplayers', undefined));
	} catch (err) {
		console.log('Could not get recent players', err);
		const { data } = err.response;

		yield put(setSuccess('recentplayers', undefined));
		yield put(setErrors('recentplayers', err.response.data.message));
	}
}

function* watchGetPlayerSummary() {
	yield takeLatest(GET_PLAYER_SUMMARY, getPlayerSummaryAsync);
}

function* watchSearchPlayers() {
	yield takeLatest(SEARCH_PLAYERS, searchPlayersAsync);
}

function* watchGetRecentPlayers() {
	yield takeLatest(GET_RECENT_PLAYERS, getRecentPlayersAsync);
}

export default function* playerSagas() {
	yield all([
		call(watchGetPlayerSummary),
		call(watchSearchPlayers),
		call(watchGetRecentPlayers),
	]);
}