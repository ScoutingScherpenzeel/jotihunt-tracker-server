import * as traccarrService from '../services/traccarr.service';

async function getDevices(req, res) {
  try {
    const devices = await traccarrService.getDevices();
    res.json(devices);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

async function getPositions(req, res) {
  try {
    const positions = await traccarrService.getPositions();
    res.json(positions);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export { getDevices, getPositions };
